from typing import List

from flask_restful import reqparse, Resource

from part.authentication import authorized, hashAndSalt, verify
from part.exceptions import NotAuthorizedException, UserAlreadyExistsException, WrongCredentialsException
from part.model.user import User
from flask import request

from part.util.response import makeResponse

getUserByIdRequestParser = reqparse.RequestParser()
getUserByIdRequestParser.add_argument("id", type=str)


class GetUserByIdResource(Resource):
    method_decorators = [authorized()]

    def get(self):
        args = getUserByIdRequestParser.parse_args()
        if not args["id"] == request.context["uid"] and not "admin" in request.context.roles:
            raise NotAuthorizedException()
        user: User = User.getById(args["id"])
        return makeResponse({"data": user.toDictionary()})


class GetCurrentUserResource(Resource):
    method_decorators = [authorized()]

    def get(self):
        user: User = User.getById(request.context["uid"])
        return makeResponse({"data": user.toDictionary()})


class GetAllUsersResource(Resource):
    method_decorators = [authorized(requiredRoles=["admin"])]

    def get(self):
        users: List[User] = User.getAllSortedByTimestamp()
        return makeResponse({"data": [user.toDictionary() for user in users]})


createUserRequestParser = reqparse.RequestParser()
createUserRequestParser.add_argument("username", type=str)
createUserRequestParser.add_argument("password", type=str)
createUserRequestParser.add_argument("emailAddress", type=str)


class CreateUserResource(Resource):
    method_decorators = [authorized(requiredRoles=["admin"])]

    def post(self):
        args = createUserRequestParser.parse_args()
        user: User = User(username=args["username"],
                          _password=hashAndSalt(args["password"]),
                          emailAddress=args["emailAddress"])
        try:
            user.save()
        except User.DuplicateKeyError:
            raise UserAlreadyExistsException()

        return makeResponse({})


deteUserRequestParser = reqparse.RequestParser()
deteUserRequestParser.add_argument("id", type=str)


class DeleteUserResource(Resource):
    method_decorators = [authorized(requiredRoles=["admin"])]

    def get(self):
        args = deteUserRequestParser.parse_args()
        user: User = User.getById(args["id"])
        if user.username == "admin":
            raise NotAuthorizedException()
        user.delete()
        return makeResponse({})


changePasswordRequestParser = reqparse.RequestParser()
changePasswordRequestParser.add_argument("id", type=str)
changePasswordRequestParser.add_argument("oldPassword", type=str)
changePasswordRequestParser.add_argument("newPassword", type=str)
changePasswordRequestParser.add_argument("confirmPassword", type=str)


class ChangePasswordResource(Resource):
    method_decorators = [authorized()]

    def post(self):
        args = changePasswordRequestParser.parse_args()
        if request.context["uid"] != args["id"]:
            raise NotAuthorizedException()
        user: User = User.getById(args["id"])
        if args["newPassword"] != args["confirmPassword"]:
            return makeResponse({"message": "Old and new passwords don't match."}, status=400)
        if not verify(bytes(user._password), args["oldPassword"]):
            raise WrongCredentialsException()
        user._password = hashAndSalt(args["newPassword"])
        user.save()
        return makeResponse({})