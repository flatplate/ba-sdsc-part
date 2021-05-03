from datetime import datetime
from uuid import uuid4

from bson import ObjectId
from pymodm import MongoModel, EmbeddedMongoModel, fields
from pymongo import DESCENDING

from .evaluation import ResultClass
from .metric import Metric
from .question import Question
from .survey import Survey
from .util import MongoModelDictionaryConvertible


class QuestionResponse(EmbeddedMongoModel, MongoModelDictionaryConvertible):
    question = fields.ReferenceField(Question)
    answer = fields.DictField()

class MetricScore(EmbeddedMongoModel, MongoModelDictionaryConvertible):
    metric = fields.ReferenceField(Metric)
    score = fields.FloatField()

    @staticmethod
    def fromMetricString(metricString: str, score: float):
        try:
            metric = Metric.objects.raw({"name": metricString}).first()
        except Metric.DoesNotExist:
            print("metric does not exist")
            return None
        return MetricScore(metric=metric, score=score)

class Response(MongoModel, MongoModelDictionaryConvertible):
    answers = fields.ListField(field=fields.EmbeddedDocumentField(QuestionResponse))
    survey = fields.ReferenceField(Survey)
    metricScores = fields.EmbeddedDocumentListField(MetricScore)
    _createdAt = fields.TimestampField(default=datetime.now)
    surveyResult = fields.EmbeddedDocumentField(ResultClass)

    @staticmethod
    def fromDictionary(dictionary):
        questionAnswers = [QuestionResponse(question=ObjectId(questionId), answer={"data": answer})
                           for questionId, answer in dictionary["response"].items()]

        return Response(answers=questionAnswers, survey=ObjectId(dictionary["surveyId"]))

    @classmethod
    def getAllSortedByTimestamp(cls):
        return cls.objects.raw({}).order_by(ordering=[("_createdAt", DESCENDING)])

    @classmethod
    def getById(cls, id_):
        return cls.objects.raw({"_id": ObjectId(id_)}).first()