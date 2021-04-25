from datetime import datetime, timedelta

from flask_restful import Resource, reqparse
from ..model.user import User
from ..authentication import getToken, verify, authorized, getContext, getTokenData
from ..exceptions import WrongCredentialsException
from flask import request

from ..util.response import makeResponse

adminLoginParser = reqparse.RequestParser()
adminLoginParser.add_argument('username', type=str)
adminLoginParser.add_argument('password', type=str)


class AuthenticationResource(Resource):
    def post(self):
        args = adminLoginParser.parse_args()
        try:
            user: User = User.objects.raw({"username": args["username"]}).first()
            tokenData = getTokenData(user)
            token = getToken(tokenData)
            # TODO this verify shouldn't really be here
            if verify(bytes(user._password), args["password"]):
                return makeResponse({"success": True, "data": token}, headers={
                    "Set-Cookie": "jwt=" + token + ";Secure;HttpOnly;SameSite=Strict;Max-Age=" +
                                  str(timedelta(days=30).total_seconds())
                })
        except User.DoesNotExist as e:
            pass
        raise WrongCredentialsException()


class AuthenticationTokenResource(Resource):
    method_decorators = [authorized()]

    def get(self):
        return makeResponse({"success": True, "data": request.context})


class LogoutResource(Resource):
    method_decorators = [authorized()]

    def get(self):
        print("UID", request.context["uid"])
        user: User = User.getById(request.context["uid"])
        user._invalidateAt = datetime.now()
        user.save()
        return makeResponse({}, headers={"Set-Cookie": "jwt=;"})
