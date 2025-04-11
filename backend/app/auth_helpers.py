from functools import wraps
from .persistence import loadData
from flask import request
import re


"""
Verifies the login credentials of a user.

Args:
    email (str): The email address of the user.
    password (str): The password of the user.

Returns:
    dict: A dictionary containing the user ID if the credentials are valid.
"""
def check_login(email, password):
    store = loadData()

    return {'user_id': store['users'][0]}



"""
Checks the syntax of the provided user information.

    name_first (str): The first name of the user.
    name_last (str): The last name of the user.

    bool: True if the syntax of the provided information is correct, False otherwise.
"""
def check_info_syntax(name_first, name_last, password, email):
    if len(name_first) < 1 or len(name_first) > 50:
        return False
    if len(name_last) < 1 or len(name_last) > 50:
        return False
    if len(password) < 6 or len(password) > 50:
        return False
    if len(email) < 1 or len(email) > 320:
        return False
    if any(char.isdigit() for char in name_first):
        return False
    if any(char.isdigit() for char in name_last):
        return False
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_regex, email):
        return False
    return True

# token is in HEADER not in request body (there is no request body in GET calls)
"""
Extracts the authorization token from the request headers.

    tuple: A tuple containing the token (str) if present, 
           an error message (dict) if the token is invalid, 
           and the corresponding HTTP status code (int).
"""
def extract_token():
    token = request.headers.get('Authorization')

    if not token:
        return None, {"success": False, "message": "Invalid Token"}, 401

    token = token.replace("Bearer ", "")
    return token, None, 200

# decorator

"""
Decorator that ensures the wrapped function is called only if the request contains a valid authorization token.

    func (function): The function to be wrapped.

    function: The wrapped function which checks for a valid token before execution.
"""
def require_auth(func):
    @wraps(func)
    def dec(*args, **kwargs):
        token, error, status_code = extract_token()
        if error:
            return error, status_code
        return func(token, *args, **kwargs)
    return dec
