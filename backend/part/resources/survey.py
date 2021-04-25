from bson import ObjectId
from flask_restful import Resource, reqparse

from ..authentication import authorized
from ..exceptions import SurveyNotFoundException, NoActiveSurveyException
from ..model.question import Question, Answer, AnswerQuestion, MatrixQuestion, ContactFormQuestion
from ..model.survey import Survey, SurveyQuestion
from ..util.response import makeResponse


class GetSurveysResource(Resource):
    method_decorators = [authorized()]

    def get(self):
        allSurveys = Survey.getAllSortedByTimestamp()
        allSurveysJson = {"data": [survey.to_son().to_dict() for survey in allSurveys]}
        return makeResponse(allSurveysJson)


createSurveyRequestParser = reqparse.RequestParser()
createSurveyRequestParser.add_argument("_name", type=str)
createSurveyRequestParser.add_argument("_evaluation", type=dict)
createSurveyRequestParser.add_argument("questions", type=dict, action="append")


class CreateSurveyResource(Resource):
    method_decorators = [authorized()]

    def post(self):
        args = createSurveyRequestParser.parse_args()
        survey: Survey = Survey.fromDictionary(args)
        survey.save()
        return makeResponse({})


setActiveSurveyRequestParser = reqparse.RequestParser()
setActiveSurveyRequestParser.add_argument("surveyId", type=str)


class SetActiveSurveyResource(Resource):
    method_decorators = [authorized()]

    def post(self):
        args: dict = setActiveSurveyRequestParser.parse_args()
        surveyId: str = args["surveyId"]

        survey: Survey = Survey.getById(surveyId)
        if survey is None:
            raise SurveyNotFoundException()

        Survey.objects.all().update({"$set": {"active": False}})
        survey.active = True
        survey.save()
        return makeResponse({})


setInactiveSurveyRequestParser = reqparse.RequestParser()
setInactiveSurveyRequestParser.add_argument("surveyId", type=str)


class SetInactiveSurveyResource(Resource):
    method_decorators = [authorized()]

    def post(self):
        args: dict = setInactiveSurveyRequestParser.parse_args()
        surveyId: str = args["surveyId"]

        survey: Survey = Survey.getById(surveyId)
        if survey is None:
            raise SurveyNotFoundException()

        survey.active = False
        survey.save()
        return makeResponse({})


class GetActiveSurveyResource(Resource):
    @staticmethod
    def _embeddedFieldToDictionary(field):
        returnDict = field.to_son().to_dict()
        del returnDict["_cls"]
        return returnDict

    @staticmethod
    def _questionToDictionary(question: Question):
        # TODO is this good here? should this be in the model classes?
        questionDict = {"text": question.text, "tooltip": question.tooltip, "type": question.type, "id": question._id}
        if isinstance(question, AnswerQuestion):
            questionDict["answers"] = [GetActiveSurveyResource._embeddedFieldToDictionary(answer) for answer in
                                       question.answers]
        if isinstance(question, MatrixQuestion):
            questionDict["rows"] = [GetActiveSurveyResource._embeddedFieldToDictionary(row) for row in question.rows]
        return questionDict

    @staticmethod
    def _stripLogic(logic):
        print(logic)
        if "or" in logic:
            elements = [{
                "answer": element["answer"],
                "operator": element["operator"],
                "question": element["question"]["_id"]
            } for element in logic["or"]]
            # TODO make more generic for the future, traverse recursively and only strip questions
            return {"or": elements}
        return logic

    @staticmethod
    def _surveyQuestionToDictionary(surveyQuestion: SurveyQuestion):
        return {
            "question": GetActiveSurveyResource._questionToDictionary(surveyQuestion.question),
            "logic": GetActiveSurveyResource._stripLogic(surveyQuestion.logic)
        }

    @staticmethod
    def _surveyToDictionary(survey: Survey):
        return {
            "id": survey._id,
            "questions": [GetActiveSurveyResource._surveyQuestionToDictionary(question) for question in
                          survey.questions]
        }

    def get(self):
        try:
            activeSurvey: Survey = Survey.objects.raw({"active": True}).first()
            # Important to send only the necessary parts of the survey since this is the user facing part (no auth)
            # and we don't want them to have more information than they need.
        except Survey.DoesNotExist:
            raise NoActiveSurveyException()

        activeSurveyDict = activeSurvey.toDictionary(omitPrivateFields=True, includeFields=["_id"])
        print("active survey dict")
        print(activeSurveyDict)
        return makeResponse(activeSurveyDict)


getSurveyByIdRequestParser = reqparse.RequestParser()
getSurveyByIdRequestParser.add_argument("id", type=str)


class GetSurveyByIdResource(Resource):
    method_decorators = [authorized()]

    def post(self):
        args = getSurveyByIdRequestParser.parse_args()
        if "id" not in args:
            raise SurveyNotFoundException()
        surveyId = args["id"]
        survey: Survey = Survey.getById(surveyId)
        if survey is None:
            raise SurveyNotFoundException()
        data = survey.toDictionary(omitPrivateFields=False)
        return makeResponse({"data": data})


editSurveyRequestParser = reqparse.RequestParser()
editSurveyRequestParser.add_argument("_id", type=str)
editSurveyRequestParser.add_argument("active", type=bool)
editSurveyRequestParser.add_argument("_createdAt", type=str)
editSurveyRequestParser.add_argument("_evaluation", type=dict)
editSurveyRequestParser.add_argument("_name", type=str)
editSurveyRequestParser.add_argument("questions", type=dict, action="append")


class EditSurveyResource(Resource):
    method_decorators = [authorized()]

    def post(self):
        args = editSurveyRequestParser.parse_args()
        print(args)
        if "_id" not in args:
            print("asdf")
            raise SurveyNotFoundException()
        newSurvey: Survey = Survey.fromDictionary(args)
        oldSurvey: Survey = Survey.getById(args["_id"])
        newSurvey._id = oldSurvey._id
        newSurvey.createdAt = oldSurvey._createdAt
        newSurvey.active = oldSurvey.active
        oldSurvey.delete()
        newSurvey.save()
        return makeResponse({})


deleteSurveyRequestParser = reqparse.RequestParser()
deleteSurveyRequestParser.add_argument("id", type=str)

class DeleteSurveyResource(Resource):
    method_decorators = [authorized()]

    def get(self):
        args = deleteSurveyRequestParser.parse_args()
        survey = Survey.getById(args["id"])
        survey.delete()
        return makeResponse({})