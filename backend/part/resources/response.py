import os
from typing import List

from io import StringIO
import csv
from flask_restful import Resource, reqparse

from part.authentication import authorized
from part.config import getFileUploadFolder
from part.evaluation.data import getDataEvaluationStrategyByName, AbstractDataEvaluationStrategy
from part.evaluation.evaluation import calculateMetricScores, selectResultClass
from part.model.question import Question, DataQuestion
from part.model.response import Response, QuestionResponse
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
                    question.evaluationStrategy
                )
                if evaluationStrategy is None:
                    print("Evaluation strategy does not exist")
                    pass  # TODO do something different, delete the file etc
                dataQuestionResponse = questionResponse.answer
                if "data" in dataQuestionResponse and dataQuestionResponse["data"] is not None:
                    fileUUID = dataQuestionResponse["data"]["uploadId"]
                    df = pandas.read_csv(os.path.join(getFileUploadFolder(), fileUUID))
                    result = evaluationStrategy.process(df, dataQuestionResponse["data"]["metadata"])
                    print("Result: ", result)
                    questionResponse.answer["data"] = result
                    os.remove(os.path.join(getFileUploadFolder(), fileUUID))
        newResponse.metricScores = calculateMetricScores(survey)
        print([answer.toDictionary() for answer in newResponse.answers])
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


getResponseRequestParser = reqparse.RequestParser()
getResponseRequestParser.add_argument("id", type=str)


class GetResponseResource(Resource):
    method_decorators = [authorized()]

    def get(self):
        args = getResponseRequestParser.parse_args()
        id_ = args["id"]
        response = Response.getById(id_)
        return makeResponse({"data": response.toDictionary(omitPrivateFields=False)})


class ResponseCsvExportResource(Resource):
    method_decorators = [authorized()]

    def get(self):
        responses: List[Response] = Response.getAllSortedByTimestamp()
        mappedResponses = [mapResponseToSimpleJson(response) for response in responses]
        fieldNames = {key for response in mappedResponses for key in response}
        stringOutput = StringIO()
        writer = csv.DictWriter(stringOutput, fieldnames=fieldNames)
        writer.writeheader()
        for response in mappedResponses:
            writer.writerow(response)
        return makeResponse(body=stringOutput.getvalue(),
                            contentType="text/csv",
                            headers={"Content-Disposition": "attachment;filename=responses.csv"})



def mapResponseToSimpleJson(response: Response) -> dict:
    simpleJsonDict = {"createdAt": response._createdAt}
    for answer in response.answers:
        simpleJsonDict[answer.question._name] = answer.answer
    return flattenDict(simpleJsonDict)

def flattenDict(dict_: dict, currentKey="") -> dict:
    flatDict = {}
    for key, value in dict_.items():
        dictKey = currentKey + " " + key if currentKey else key
        if isinstance(value, dict):
            flatDict.update(flattenDict(value, dictKey))
        else:
            flatDict[dictKey] = value
    return flatDict