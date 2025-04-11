# this file contains the actual logic for login.
import logging
from flask_mail import Message
from .helpers import time_now
from .token2 import generate_token, jwt_decode
import hashlib
from sqlalchemy.orm import Session
from .persistence import loadData, saveData
import random
from .extensions import api,db,MAIL
import pymongo
import datetime
import os

mongo_uri = os.getenv('MONGO_URI')
if os.getenv('LD_LIBRARY_PATH') == None:
    mongo_uri = 'mongodb://root:root@localhost:27017/'
myclient = pymongo.MongoClient(mongo_uri)
mydb = myclient["data"]
token_db = mydb["token"]
user_db = mydb["user"]
user_id_db = mydb["user_id"]

def get_new_user_id():
    user_id_result = user_id_db.find_one({'type': 'user_id'})
    if user_id_result:
        new_id = user_id_result['value']
        user_id_result['value'] = user_id_result['value'] + 1
        user_id_db.update_one({'type': 'user_id'}, {"$set": user_id_result})
        return new_id
    else:
        user_id_db.insert_one({
            "type": 'user_id',
            'value': 1,
        })
        return 0

# Hashes a password using SHA-256 encryption and returns the hashed result.
def hash(password):
    return hashlib.sha256(str(password).encode()).hexdigest()

# Deletes a user account if the provided token is valid.
# Parameters:
#   - token (str): The authentication token of the user.
# Returns:
#   - dict: Success or error message indicating the result of the deletion attempt.
#   - int: HTTP status code (200 if successful, 404 if user not found, 401 if unauthorized, 500 for server error).
def auth_delete_account(token):
    try:
        check, user_id = check_token(token)
        if check:
            user_db.delete_one({'auth_user_id': user_id})
            return {"success": True, "message": "Account deleted successfully"}, 200
        else:
            return {"success": False, "message": "Unauthorized: Invalid token"}, 401
    except Exception as e:
        return {"success": False, "message": "Internal Server Error"}, 500

# Authenticates a user based on their email and password.
# Parameters:
#   - email (str): The email of the user attempting to log in.
#   - password (str): The password of the user attempting to log in.
# Returns:
#   - dict: Success status, user ID, and token if login is successful; error message if login fails.
#   - int: HTTP status code (200 if successful, 400 if input is invalid or user not verified).
def auth_login(email, password):
    if "" in [email, password]:
        return {"success": False, "message": "Invalid Input"}, 400
    password = hash(password)
    user_match = user_db.find_one({"email": email, "password": password})

    if not user_match:
        return {"success": False, "message": "Invalid email or password"}, 400

    if not user_match["verified"]:
        return {"success": False, "message": "User not verified"}, 400

    token = generate_token(user_match["auth_user_id"], datetime.datetime.now().timestamp())
    token_db.insert_one({
        "user_id": user_match["auth_user_id"],
        'token': token,
        "expires_at": datetime.datetime.now().timestamp() + 7 * 24 * 3600
    })
    return {
        "success": True,
        "user_id": user_match["auth_user_id"],
        'token': token
    }, 200

# Registers a new user with the provided details.
# Parameters:
#   - email (str): User's email.
#   - password (str): User's password.
#   - first_name (str): User's first name.
#   - last_name (str): User's last name.
#   - title (str): User's title (e.g., Dr., Mr., Ms.).
#   - position (str): User's position in their organization.
#   - profile_img (str): URL or path to the user's profile image (optional).
#   - organisation (str): The user's organization name.
# Returns:
#   - dict: Success status, user ID, and verification token.
#   - int: HTTP status code (201 for success, 400 for input errors).
def auth_register(email, password, first_name, last_name, title, position, profile_img, organisation):
    # profile img can be empty
    if "" in [email, password, first_name, last_name, title, position, organisation]:
        return {"success": False, "message": "Invalid Input"}, 400
    # user_data = loadData()
    user_with_name = user_with_email = user_db.find_one({
        "name_first": first_name,
        "title": title,
        "name_last": last_name,
    })
    
    if  user_with_name:
        return {"success": False, "message": "This profile has been registered"}, 400
    user_with_email = user_db.find_one({'email': email})
    if user_with_email:
        return {"success": False, "message": "This email has been registered"}, 400
    user_id = get_new_user_id()

    # Create new user object and append to user data
    last_logout = str(time_now())
    verify_token = generate_token(user_id, last_logout)
    user = {
      "auth_user_id": user_id,
      "name_first": first_name,
      "name_last": last_name,
      "email": email,
      "password": hash(password),
      "profile_img": profile_img,
      "position": position,
      "title": title,
      "organisation": organisation,
      "doctor_name": title + " " + first_name + " " + last_name,
      "last_logout": last_logout,
      "verified": False,
      "verify_token": verify_token,
      "reset_code": ""
    }
    user_db.insert_one(user)

    token = generate_token(user_id, datetime.datetime.now().timestamp())
    token_db.insert_one({
        "user_id": user_id,
        'token': token,
        "expires_at": datetime.datetime.now().timestamp() + 7 * 24 * 3600
    })

    # send email
    try:
        msg = Message('Email verify', recipients=[email])
        msg.body = 'Please verify your email via token: ' + user["verify_token"]
        MAIL.send(msg)
    except:
        return {"success": False, "message": "Error occurs while sending the email"}, 400

    return {
        "success": True,
        "user_id": user_id,
        'token': token,
        'verify_token': user["verify_token"]
    }, 201

# Verifies a user account using the verification token.
# Parameters:
#   - verify_token (str): The token sent to the user for email verification.
# Returns:
#   - dict: Success status.
#   - int: HTTP status code (201 for success, 400 for failure).
def auth_verify(verify_token):
    result = user_db.update_one({'verify_token': verify_token}, {"$set": {"verified": True}})
    
    if result.matched_count == 0:
        return {
            "success": False,
            "message": "Verification token not exist."
        }, 400
    
    return {
        "success": True,
    }, 201


# Checks if a user's account is verified based on the authentication token.
# Parameters:
#   - token (str): The authentication token for the user.
# Returns:
#   - dict: Success status and verification status.
#   - int: HTTP status code (200 for success, 500 for server error).
def auth_check_verify(token):
    try:
        check, user_id = check_token(token)
        if check:
            user_query = user_db.find_one({'auth_user_id': user_id})
            if user_query:
                return {
                    "success": True,
                    "verified": user_query.get("verified", False),
                }, 200
        return {
            "success": True,
            "verified": False,
        }, 200
    except Exception as e:
        return {
            "success": False,
            "message": "Internal Server Error"
        }, 500

# Logs out the user by updating their last logout timestamp.
# Parameters:
#   - token (str): The authentication token of the user.
# Returns:
#   - dict: Success status.
#   - int: HTTP status code (200 for success, 400 if token is invalid).
def auth_logout(token):
    check, user_id = check_token(token)
    if check:
        token_query = {"token": token}
        token_db.delete_one(token_query)
        return {
            "success": True,
        }, 200
    else:
        return {
            "success": False,
        }, 400

# Verifies if a token is valid and returns the user ID if valid.
# Parameters:
#   - token (str): The token to verify.
# Returns:
#   - bool: Whether the token is valid.
#   - user_id (int or None): The user ID if the token is valid, otherwise None.
def check_token(token):
    try:
        token_query = {"token": token}
        user_info = token_db.find_one(token_query)
        if user_info:
            user_id = user_info['user_id']
            expires_at = user_info['expires_at']
            now = datetime.datetime.now().timestamp()
            if now > expires_at:
                token_db.delete_one(token_query)
                return False, None
            else:
                return True, user_id
        else:
            return False, None
    except:
        return False, None

# Sends a reset password request email to the user if their email exists in the system.
# Parameters:
#   - email (str): The user's email.
# Returns:
#   - dict: Success message or error if email is invalid.
#   - int: HTTP status code (200 for success, 400 if email is not found).
def auth_reset_password_request(email):
    user_select = user_db.find_one({'email': email})
    if user_select == None:
        return {"success": False, "message": "Invalid email."}, 400
    code = hash(str(time_now()) + str(random.random()))
    user_db.update_one({'email': email}, {"$set": {"reset_code": code}})

    msg = Message('Reset Password', recipients=[email])
    msg.body = 'Please reset your password via token ' + str(code)
    MAIL.send(msg)
    return {"success": True, "message": "Successfully sent.", "reset_code": code}, 200

# Resets the user's password using a reset code.
# Parameters:
#   - reset_code (str): The reset code sent to the user's email.
#   - password (str): The new password.
# Returns:
#   - dict: Success message or error if reset code is invalid.
#   - int: HTTP status code (200 for success, 400 if token is invalid).
def auth_reset_password(reset_code, password):
    user_select = user_db.find_one({'reset_code': reset_code})
    if user_select == None:
        return {"success": False, "message": "Invalid token."}, 400
    user_db.update_one({'reset_code': reset_code}, {"$set": {"reset_code": '', "password": hash(password), "last_logout": time_now()}})

    return {"success": True, "message": "Successfully reset."}, 200


# Edits the user's profile details.
# Parameters:
#   - token (str): The authentication token of the user.
#   - position, avatar, first_name, last_name, title, organisation, password: Profile fields to update.
# Returns:
#   - dict: Success status.
#   - int: HTTP status code (200 for success, 400 if token is invalid).
def auth_edit_profile(token, position, avatar, first_name, last_name, title, organisation, password):
    check, user_id = check_token(token)
    if check:
        user = user_db.find_one({'auth_user_id': user_id})
        if user:
            user["name_first"] = first_name
            user["name_last"] = last_name
            user["position"] = position
            user["profile_img"] = avatar
            user["title"] = title
            user["organisation"] = organisation
            user["doctor_name"] = title + " " + first_name + " " + last_name
            if user['password'] != password:
                user['password'] = hash(password) # prevent hashing an unchanged pwd
            user_db.update_one({'auth_user_id': user_id}, {"$set": user})
            return {
                "success": True,
            }, 200

        return {
            "success": False,
        }, 400
    else:
        return {
            "success": False,
        }, 400

# Retrieves the profile of a specific user.
# Parameters:
#   - token (str): The authentication token of the requesting user.
#   - userId (int): The ID of the user whose profile is requested.
# Returns:
#   - dict: Success status and user profile details.
#   - int: HTTP status code (200 for success, 400 if token is invalid).
def auth_get_profile(token, userId):
    check, user_id = check_token(token)
    if check:
        user = user_db.find_one({"auth_user_id": user_id})
        select_users = []
        if user:
            append_user = {
                "auth_user_id": user["auth_user_id"],
                "title": user["title"],
                "name_first": user["name_first"],
                "name_last": user["name_last"],
                "email": user["email"],
                "profile_img": user["profile_img"],
                "position": user["position"],
                "organisation": user["organisation"],
                "password": user["password"],
            }
            select_users.append(append_user)
        return {
            "success": True,
            "user": select_users,
        }, 200
    else:
        return {
            "success": False,
        }, 400

# Retrieves all profiles except the one matching the requesting user.
# Parameters:
#   - token (str): The authentication token of the requesting user.
# Returns:
#   - dict: Success status and list of profiles.
#   - int: HTTP status code (200 for success, 400 if token is invalid).
def auth_get_all_profile(token):
    check, user_id = check_token(token)
    if check:
        response_data = []
        users = user_db.find()
        for user in users:
            if user['auth_user_id'] != -1 and user['auth_user_id'] != user_id:
                response_data.append({
                    "name": user["doctor_name"],
                    "position": user["position"],
                    "picture": user["profile_img"],
                })
            else:
                response_data.insert(0, {
                    "name": user["doctor_name"],
                    "position": user["position"],
                    "picture": user["profile_img"],
                })
        return {
            "success": True,
            "users": response_data,
        }, 200
    else:
        return {
            "success": False,
        }, 400
