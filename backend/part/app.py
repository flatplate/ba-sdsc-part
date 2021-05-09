from flask import Flask
from flask_restful import Api

from part.util.json import CustomEncoder
from part.util.file import deleteOldUploadedFiles
from .database import initDatabase
from .resources import *
from flask_cors import CORS
from .config import initConfig
from .config import AppConfig
from .config import getFileUploadFolder
from .exceptions import errors
import schedule


app = Flask(__name__)
api = Api(app, errors=errors)
CORS(app)
app.config.from_object(AppConfig)
app.json_encoder = CustomEncoder

def initCronJob():
    schedule.every(1).day.do(deleteOldUploadedFiles)

def initFolders():
    fileUploadFolderPath = getFileUploadFolder()
    if not os.path.exists(fileUploadFolderPath):
        os.makedirs(fileUploadFolderPath)

@app.before_first_request
def init():
    initConfig()
    initDatabase()
    initFolders()
    initCronJob()


api.add_resource(EditQuestionResource, '/api/v1/editQuestion')
api.add_resource(GetQuestionsResource, '/api/v1/getQuestions')
api.add_resource(CreateQuestionResource, '/api/v1/createQuestion')
api.add_resource(DeleteQuestionResource, '/api/v1/deleteQuestion')
api.add_resource(QuestionTypeResource, '/api/v1/questionTypes')
api.add_resource(AuthenticationResource, '/api/v1/authenticate')
api.add_resource(AuthenticationTokenResource, '/api/v1/authenticated')
api.add_resource(GetQuestionByIdResource, '/api/v1/getQuestionById')
api.add_resource(GetSurveysResource, '/api/v1/getSurveys')
api.add_resource(CreateSurveyResource, '/api/v1/createSurvey')
api.add_resource(SetActiveSurveyResource, '/api/v1/setActiveSurvey')
api.add_resource(SetInactiveSurveyResource, '/api/v1/setInactiveSurvey')
api.add_resource(GetActiveSurveyResource, '/api/v1/getActiveSurvey')
api.add_resource(GetSurveyByIdResource, '/api/v1/getSurveyById')
api.add_resource(EditSurveyResource, '/api/v1/editSurvey')
api.add_resource(DataTypeResource, '/api/v1/dataType')
api.add_resource(DataUploadResource, '/api/v1/dataFileUpload')
api.add_resource(PostResponseResource, '/api/v1/postResponse')
api.add_resource(DataEvaluationStrategyResource, '/api/v1/dataEvaluationStrategies')
api.add_resource(MetricsResource, '/api/v1/metrics')
api.add_resource(GetResponsesResource, '/api/v1/getResponses')
api.add_resource(EvaluationMetadataResource, '/api/v1/evaluationMetadata')
api.add_resource(CreateEvaluationResource, '/api/v1/createEvaluation')
api.add_resource(EditEvaluationResource, '/api/v1/editEvaluation')
api.add_resource(GetEvaluationsResource, '/api/v1/getEvaluations')
api.add_resource(GetEvaluationByIdResource, '/api/v1/evaluationById')
api.add_resource(DeleteEvaluationResource, '/api/v1/deleteEvaluation')
api.add_resource(DeleteSurveyResource, '/api/v1/deleteSurvey')
api.add_resource(LogoutResource, '/api/v1/logout')
api.add_resource(GetResponseResource, '/api/v1/getResponse')
api.add_resource(GetUserByIdResource, '/api/v1/getUser')
api.add_resource(GetCurrentUserResource, '/api/v1/getCurrentUser')
api.add_resource(GetAllUsersResource, '/api/v1/getUsers')
api.add_resource(CreateUserResource, '/api/v1/createUser')
api.add_resource(DeleteUserResource, '/api/v1/deleteUser')
api.add_resource(ChangePasswordResource, '/api/v1/changePassword')

if __name__ == "__main__":
    print("alksdfasdf")
    app.run(host='0.0.0.0', port=5000, debug=True)