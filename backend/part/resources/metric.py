from flask_restful import Resource, reqparse
from pymongo import ASCENDING
from pymongo.errors import DuplicateKeyError

from part.authentication import authorized
from part.exceptions import MetricAlreadyExistsException
from part.model.metric import Metric
from part.util.response import makeResponse


metricRequestParser = reqparse.RequestParser()
metricRequestParser.add_argument("metricName", type=str)

class MetricsResource(Resource):
    method_decorators = [authorized()]

    def get(self):
        allMetrics = Metric.objects.raw({}).order_by(ordering=[("name", ASCENDING)])
        allMetricsJson = {"data": [metric.toDictionary(omitPrivateFields=False) for metric in allMetrics]}
        return makeResponse(allMetricsJson)

    def put(self):
        args = metricRequestParser.parse_args()
        newMetric = Metric(name=args["metricName"])
        try:
            newMetric.save()
            return makeResponse({"success": True})
        except DuplicateKeyError:
            raise MetricAlreadyExistsException()

    def delete(self):
        args = metricRequestParser.parse_args()
        print(args["metricName"])
        metric = Metric.objects.raw({"name": args["metricName"]}).first()
        metric.delete()
        return makeResponse({"success": True})
