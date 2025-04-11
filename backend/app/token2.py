import hashlib
import jwt

JWT_SECRET = 'SEIKO'

"""
Hashes a password using SHA-256.
Parameters:
    - password (str): The password to hash.
Returns:
    - str: The hashed password as a hexadecimal string.
"""
def hash(password):
    return hashlib.sha256(str(password).encode()).hexdigest()


"""
Generates a JWT token for a user.
Parameters:
    - user_id (int): The ID of the user.
    - last_logout (str): The timestamp of the user's last logout.
Returns:
    - str: The encoded JWT token.
"""
def generate_token(user_id, last_logout):
    
    ENCODED_JWT = jwt.encode({"user_id": user_id, "last_logout": last_logout}, JWT_SECRET, algorithm='HS256')

    return ENCODED_JWT

"""
Decodes a JWT token.
Parameters:
    - token (str): The JWT token to decode.
Returns:
    - dict: The decoded JWT payload.
"""
def jwt_decode(token):
    # TODO raise AccessErrors if not in db
    decode = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    print(decode)
    return decode
