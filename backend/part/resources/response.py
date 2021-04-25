import os
from typing import List

from bson import ObjectId
from flask_restful import Resource, reqparse

from part.authentication import authorized
from part.config import getFileUploadFolder
from part.evaluation.data import getDataEvaluationStrategyByName, AbstractDataEvaluationStrategy
from part.evaluation.evaluation import calculateMetricScores, selectResultClass
from part.model.question import Question, DataQuestion
from part.model.response import Response, QuestionResponse
from part.model.survey import Survey
from part.util.response import makeResponse

import pandas

postResponseRequestParser = reqparse.RequestParser()
postResponseRequestParser.add_argument("surveyId", type=str)
postResponseRequestParser.add_argument("response", type=dict)


class PostResponseResource(Resource):

    def post(self):
        args = postResponseRequestParser.parse_args()
        print("args response", args["response"])
        newResponse = Response.fromDictionary({"surveyId": args["surveyId"], "response": args["response"]})
        survey: List[QuestionResponse] = newResponse.answers
        for questionResponse in survey:
            question = questionResponse.question
            if isinstance(question, DataQuestion):
                evaluationStrategy: AbstractDataEvaluationStrategy = getDataEvaluationStrategyByName(
                    question.evaluationStrategy)
                if evaluationStrategy is None:
                    pass  # TODO do something different, delete the file etc
                dataQuestionResponse = questionResponse.answer
                if "data" in dataQuestionResponse and dataQuestionResponse["data"] is not None:
                    fileUUID = dataQuestionResponse["data"]["uploadId"]
                    df = pandas.read_csv(os.path.join(getFileUploadFolder(), fileUUID))
                    result = evaluationStrategy.process(df, dataQuestionResponse["data"]["metadata"])
                    questionResponse.answer = result
        newResponse.metricScores = calculateMetricScores(survey)
        resultClass = selectResultClass(newResponse.metricScores, newResponse.survey._evaluation)
        if resultClass:
            newResponse.surveyResult = resultClass
        newResponse.save()

        return makeResponse({"result": resultClass.resultText})


class GetResponsesResource(Resource):
    method_decorators = [authorized()]

    def get(self):
        allResponses = Response.getAllSortedByTimestamp()
        allResponsesJson = {"data": [response.toDictionary(omitPrivateFields=False) for response in allResponses]}
        return makeResponse(allResponsesJson)
