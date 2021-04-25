from bson import ObjectId
from pymodm import MongoModel, EmbeddedMongoModel, fields
from pymongo import IndexModel, DESCENDING
from datetime import datetime

from .evaluation import Evaluation
from .question import Question
from .util import DictionaryConvertible, MongoModelDictionaryConvertible


class LogicCondition(EmbeddedMongoModel, MongoModelDictionaryConvertible):
    question = fields.ReferenceField(Question)  # TODO on_delete
    operator = fields.CharField()
    answer = fields.CharField()

    @staticmethod
    def fromDictionary(dict_):
        return LogicCondition(question=ObjectId(dict_["question"]["_id"]),
                              operator=dict_["operator"],
                              answer=dict_["answer"])


class Logic(EmbeddedMongoModel, MongoModelDictionaryConvertible):
    action = fields.CharField()
    conditions = fields.ListField(field=fields.EmbeddedDocumentField(LogicCondition))

    @staticmethod
    def fromDictionary(dict_):
        return Logic(action=dict_["action"],
                     conditions=[LogicCondition.fromDictionary(condition) for condition in dict_["conditions"]])

class SurveyQuestion(EmbeddedMongoModel, MongoModelDictionaryConvertible):
    question = fields.ReferenceField(Question)
    logic = fields.ListField(fields.EmbeddedDocumentField(Logic))

    @staticmethod
    def fromDictionary(dict_):
        kwargs = {"question": ObjectId(dict_["question"]["_id"])}
        if "logic" in dict_ and dict_["logic"]:
            kwargs["logic"] = [Logic.fromDictionary(logic) for logic in dict_["logic"]]
        return SurveyQuestion(**kwargs)


class Survey(MongoModel, MongoModelDictionaryConvertible):
    active = fields.BooleanField(default=False)
    _name = fields.CharField(required=True)
    questions = fields.ListField(fields.EmbeddedDocumentField(SurveyQuestion))
    _evaluation = fields.ReferenceField(Evaluation)
    _createdAt = fields.TimestampField(default=datetime.now)

    class Meta:
        indexes = [IndexModel([('_name', 1)], unique=True)]

    @classmethod
    def getAllSortedByTimestamp(cls):
        return cls.objects.raw({}).order_by(ordering=[("_createdAt", DESCENDING)])

    @staticmethod
    def fromDictionary(dict_):
        kwargs = {"_name": dict_["_name"]}
        questions = dict_["questions"]
        if questions:
            kwargs["questions"] = [SurveyQuestion.fromDictionary(question) for question in questions]
        if "_evaluation" in dict_ and dict_["_evaluation"]:
            kwargs["_evaluation"] = Evaluation.getById(dict_["_evaluation"]["_id"])
        return Survey(**kwargs)

    @classmethod
    def getById(cls, surveyId: ObjectId):
        try:
            return cls.objects.raw({"_id": ObjectId(surveyId)}).first()
        except cls.DoesNotExist:
            return None
