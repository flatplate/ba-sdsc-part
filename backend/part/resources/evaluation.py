from flask_restful import Resource, reqparse

from part.authentication import authorized
from part.model.evaluation import Evaluation
from part.model.metric import Metric
from part.util.response import makeResponse


class GetEvaluationsResource(Resource):
    method_decorators = [authorized()]

    def get(self):
        evaluations = [evaluation.toDictionary(omitPrivateFields=False)
                       for evaluation in Evaluation.getAllSortedByTimestamp()]

        return makeResponse({"data": evaluations})


getEvaluationByIdRequestParser = reqparse.RequestParser()
getEvaluationByIdRequestParser.add_argument('id', type=str)


class GetEvaluationByIdResource(Resource):
    method_decorators = [authorized()]

    def get(self):
        args = getEvaluationByIdRequestParser.parse_args()
        id_ = args["id"]
        evaluation = Evaluation.getById(id_)

        return makeResponse({"data": evaluation.toDictionary(omitPrivateFields=False)})


createEvaluationRequestParser = reqparse.RequestParser()
createEvaluationRequestParser.add_argument('evaluationData', type=dict)


class CreateEvaluationResource(Resource):
    method_decorators = [authorized()]

    def post(self):
        args = createEvaluationRequestParser.parse_args()
        evaluation = Evaluation.fromDictionary(args["evaluationData"])
        try:
            evaluation.save()
            return makeResponse({})
        except Exception as e:
            # TODO throw custom exception and define the return stuff in exceptions file
            print(str(e))
            return makeResponse({}, status=400)


editEvaluationRequestParser = reqparse.RequestParser()
editEvaluationRequestParser.add_argument('evaluationData', type=dict)


class EditEvaluationResource(Resource):
    method_decorators = [authorized()]

    def post(self):
        args = createEvaluationRequestParser.parse_args()
        oldEvaluation = Evaluation.getById(args["evaluationData"]["_id"])
        evaluation = Evaluation.fromDictionary(args["evaluationData"])
        evaluation._id = oldEvaluation._id
        evaluation._createdAt = oldEvaluation._createdAt

        try:
            oldEvaluation.delete()
            evaluation.save()
            return makeResponse({})
        except Exception as e:
            # TODO throw custom exception and define the return stuff in exceptions file
            print(str(e))
            return makeResponse({}, status=400)


class EvaluationMetadataResource(Resource):
    """
    This resource is responsible for supplying information like allowed values for the possible metrics, allowed
    operations for the evaluation result classes.
    """
    method_decorators = [authorized()]

    def get(self):
        metricNames = [metric.name for metric in Metric.objects.raw({})]
        metricNames.extend(["min", "max", "avg"])
        return makeResponse({"data": {"metricNames": metricNames, "allowedOperations": [">", "<"]}})


deleteEvaluationRequestParser = reqparse.RequestParser()
deleteEvaluationRequestParser.add_argument('id', type=str)

class DeleteEvaluationResource(Resource):
    method_decorators = [authorized()]

    def post(self):
        args = deleteEvaluationRequestParser.parse_args()
        evaluation = Evaluation.getById(args["id"])
        evaluation.delete()

        return makeResponse({})