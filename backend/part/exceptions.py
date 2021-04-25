from werkzeug.exceptions import HTTPException

class QuestionAlreadyExistsException(HTTPException):
    pass

class UserAlreadyExistsException(HTTPException):
    pass

class NotAuthenticatedException(HTTPException):
    pass

class AuthenticationFailedException(HTTPException):
    pass

class SurveyAlreadyExistsException(HTTPException):
    pass

class QuestionNotFoundException(HTTPException):
    pass

class MissingUserRoleException(HTTPException):
    pass

class WrongCredentialsException(HTTPException):
    pass

class SurveyNotFoundException(HTTPException):
    pass

class NoActiveSurveyException(HTTPException):
    pass

class MetricAlreadyExistsException(HTTPException):
    pass

errors = {
    'QuestionAlreadyExistsException': {
        'message': "A Question with the same name already exists.",
        'status': 409,
    },
    'UserAlreadyExistsException': {
        'message': "A user with the same credentials already exists.",
        'status': 409,
    },
    'NotAuthenticatedException': {
        'status': 401,
    },
    'AuthenticationFailedException': {
        'message': "Authentication failed.",
        'status': 401,
    },
    'SurveyAlreadyExistsException': {
        'message': "A Survey with the same name already exists.",
        'status': 409,
    },
    'QuestionNotFoundException': {
        'message': "The given question could not be found.",
        'status': 404,
    },
    'MissingUserRoleException': {
        'message': "You do not have the necessary roles to do that.",
        'status': 403
    },
    'WrongCredentialsException': {
        'message': "Username or password is wrong",
        'status': 401
    },
    'SurveyNotFoundException': {
        'message': "Survey with the given ID could not be found",
        'status': 404
    },
    'NoActiveSurveyException': {
        'message': "There is currently no active survey, please try again later",
        'status': 404
    },
    'MetricAlreadyExistsException': {
        'message': "A metric with the same name already exists",
        'status': 409
    }
}