from flask import make_response
from flask_restful import Resource, reqparse
from pymodm.errors import DoesNotExist
from pymongo.errors import DuplicateKeyError

from ..model.question import Question
from ..model.question import fromDictionary as questionFromDictionary
from ..model.question import fromId as questionFromId
from ..model.question import questionTypes

from ..authentication import authorized
from ..exceptions import QuestionAlreadyExistsException, QuestionNotFoundException

from ..util.response import makeResponse
from ..evaluation.data import getDataEvaluationStrategies

from ..evaluation.data import dataEvaluationStrategies

from bson import ObjectId


class GetQuestionsResource(Resource):
    method_decorators = [authorized()]

    def get(self):
        allQuestions = Question.getAllSortedByTimestamp()
        allQuestionsJson = {"data": [question.to_son().to_dict() for question in allQuestions]}
        return makeResponse(allQuestionsJson)


createQuestionRequestParser = reqparse.RequestParser()
createQuestionRequestParser.add_argument("_name", type=str)
createQuestionRequestParser.add_argument("type", type=str)
createQuestionRequestParser.add_argument("text", type=str)
createQuestionRequestParser.add_argument("tooltip", type=str)
createQuestionRequestParser.add_argument("evaluationStrategy", type=str)
createQuestionRequestParser.add_argument("answers", type=dict, action="append")
createQuestionRequestParser.add_argument("rows", type=dict, action="append")
createQuestionRequestParser.add_argument("_metricEffects", type=dict, action="append")


class CreateQuestionResource(Resource):
    method_decorators = [authorized()]

    def post(self):
        args = createQuestionRequestParser.parse_args()
        print("args", args)
        question = questionFromDictionary(args)
        try:
            question.save()
            return makeResponse({"success": True})
        except DuplicateKeyError as e:
            raise QuestionAlreadyExistsException()
        except Exception as e:
            print(e)
            return makeResponse({"success": False, "message": "An unknown error has occurred, try again later."},
                                status=500)


editQuestionRequestParser = reqparse.RequestParser()
editQuestionRequestParser.add_argument("_name", type=str)
editQuestionRequestParser.add_argument("type", type=str)
editQuestionRequestParser.add_argument("text", type=str)
editQuestionRequestParser.add_argument("tooltip", type=str)
editQuestionRequestParser.add_argument("evaluationStrategy", type=str)
editQuestionRequestParser.add_argument("answers", type=dict, action="append")
editQuestionRequestParser.add_argument("rows", type=dict, action="append")
editQuestionRequestParser.add_argument("_id", type=str)
editQuestionRequestParser.add_argument("_metricEffects", type=dict, action="append")


class EditQuestionResource(Resource):
    method_decorators = [authorized()]

    def post(self):
        args = editQuestionRequestParser.parse_args()
        print("Edit question args", args)
        question = questionFromId(args["_id"])
        newQuestion = questionFromDictionary(args)
        newQuestion._createdAt = question._createdAt
        newQuestion._id = question._id
        question.delete()
        newQuestion.save()
        return makeResponse({"success": True})


deleteQuestionRequestParser = reqparse.RequestParser()
deleteQuestionRequestParser.add_argument("id", type=str, required=True)


class DeleteQuestionResource(Resource):
    method_decorators = [authorized()]

    def post(self):
        args = deleteQuestionRequestParser.parse_args()
        question = questionFromId(args["id"])
        if question is not None:
            question.delete()
            return makeResponse({"success": True}, 200)
        raise QuestionNotFoundException()


class QuestionTypeResource(Resource):
    method_decorators = [authorized()]

    def get(self):
        return makeResponse({"data": [questionType for questionType in questionTypes.keys()]})


getQuestionByIdRequestParser = reqparse.RequestParser()
getQuestionByIdRequestParser.add_argument("id", type=str)


class GetQuestionByIdResource(Resource):
    method_decorators = [authorized()]

    def post(self):
        args = getQuestionByIdRequestParser.parse_args()
        if "id" not in args:
            raise QuestionNotFoundException()
        questionId = args["id"]
        questionObjectId = ObjectId(questionId)
        try:
            question = Question.objects.raw({"_id": questionObjectId}).first()
        except DoesNotExist:
            raise QuestionNotFoundException()
        return makeResponse({"data": question.toDictionary(omitPrivateFields=False)})


class DataEvaluationStrategyResource(Resource):
    method_decorators = [authorized()]

    def get(self):
        strategies = getDataEvaluationStrategies()
        dictStrategies = [{
            "name": strategy.name,
            "visibleName": strategy.visibleName,
            "description": strategy.description,
            "author": strategy.author,
            "optionalMetadata": strategy.optionalMetadata,
            "outputs": strategy.outputs
        } for strategy in strategies]

        return makeResponse({"data": dictStrategies})
