import os
import hashlib
from datetime import datetime, timedelta
from functools import wraps
from typing import List
from uuid import uuid4, UUID

from flask import request
import jwt
from pymodm.errors import DoesNotExist

from .model.user import User

from .config import config
from .exceptions import NotAuthenticatedException
from .exceptions import AuthenticationFailedException
from .exceptions import MissingUserRoleException

def hashAndSalt(password, saltSize=32):
    salt = os.urandom(saltSize)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return salt + key

def verify(key: bytes, password: str, saltSize=32):
    salt = key[:saltSize]
    newKeyStr = salt + hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),  # Convert the password to bytes
        salt,
        100000
    )
    newKey = newKeyStr
    return newKey == key

def authorized(requiredRoles: List[str] = None):
    if requiredRoles is None:
        requiredRoles = []

    def checkUser(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if "jwt" not in request.cookies:
                raise NotAuthenticatedException()
            token = request.cookies.get("jwt")
            try:
                data = jwt.decode(token, config["JWT_SECRET"], algorithms=["HS256"], options={"verify_aud": False})
                if not verifyTokenStructure(data):
                    raise NotAuthenticatedException()
                for role in requiredRoles:
                    if role not in data["roles"]:
                        raise MissingUserRoleException()
                request.context = data["context"]
                return func(*args, **kwargs)
            except jwt.ExpiredSignatureError:
                newTokenData = getNewTokenData(token)
                print(newTokenData)
                newToken = getToken(newTokenData)
                request.context = newTokenData["context"]
                res = func(*args, **kwargs)
                res.headers["Set-Cookie"] = "jwt=" + newToken + ";Secure;HttpOnly;SameSite=Strict;Max-Age=" \
                                            + str(int(timedelta(days=30).total_seconds()))
                return res
            except jwt.DecodeError:
                raise NotAuthenticatedException()
        return wrapper
    return checkUser

def getContext(jwtToken: str) -> dict:
    return jwt.decode(jwtToken, config["JWT_SECRET"], algorithms=["HS256"], options={"verify_aud": False})["context"]

def getNewTokenData(jwtToken: str) -> dict:
    jwtData = jwt.decode(jwtToken,
                         config["JWT_SECRET"],
                         algorithms=["HS256"],
                         options={"verify_exp": False, "verify_aud": False})
    if not verifyTokenStructure(jwtData):
        raise AuthenticationFailedException()
    if datetime.fromtimestamp(jwtData["iat"]) + timedelta(days=1) < datetime.utcnow():
        raise AuthenticationFailedException()
    uid = UUID(jwtData["context"]["uid"])
    try:
        user: User = User.objects.raw({"id": uid}).first()
        if user._invalidateAt > datetime.now():
            raise TokenExpired()
        return getTokenData(user)
    except DoesNotExist:
        raise NotAuthenticatedException()

def getTokenData(user: User) -> dict:
    return {
        "iss": "sdscpart",  # TODO get from config
        "sub": user.username,
        "aud": ["all"],
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(minutes=30),
        "jti": uuid4().hex,
        "context": {
            "user": user.username,
            "roles": user.roles,
            "uid": user.id.hex
        }
    }

def getToken(tokenData: dict) -> str:
    return jwt.encode(tokenData, config["JWT_SECRET"], algorithm="HS256")

def verifyTokenStructure(data: dict) -> bool:
    if not {"iss", "sub", "aud", "iat", "exp", "jti", "context"}.issubset(data.keys()):
        return False
    if not {"user", "roles", "uid"}.issubset(data["context"].keys()):
        return False
    return True

class TokenExpired(Exception):
    pass