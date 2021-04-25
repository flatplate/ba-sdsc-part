from datetime import datetime

from bson import ObjectId
from pymodm import MongoModel, fields, EmbeddedMongoModel
from pymongo import IndexModel, DESCENDING

from part.model.util import MongoModelDictionaryConvertible


class MetricCondition(EmbeddedMongoModel, MongoModelDictionaryConvertible):
    metric = fields.CharField(required=True)  # Charfield because of stuff like aggregate functions
    operation = fields.CharField(required=True)
    value = fields.FloatField(required=True)

    @classmethod
    def fromDictionary(cls, dictionary):
        return MetricCondition(metric=dictionary["metric"],
                               operation=dictionary["operation"],
                               value=dictionary["value"])

class ResultClass(EmbeddedMongoModel, MongoModelDictionaryConvertible):
    conditions = fields.EmbeddedDocumentListField(MetricCondition)
    resultText = fields.CharField()

    @classmethod
    def fromDictionary(cls, dictionary):
        kwargs = {"resultText": dictionary["resultText"]}
        if "conditions" in dictionary and dictionary["conditions"]:
            kwargs["conditions"] = [MetricCondition.fromDictionary(condition)
                                    for condition in dictionary["conditions"]]
        return ResultClass(**kwargs)

class Evaluation(MongoModel, MongoModelDictionaryConvertible):
    name = fields.CharField(required=True)
    description = fields.CharField()
    resultClasses = fields.EmbeddedDocumentListField(ResultClass)
    _createdAt = fields.TimestampField(default=datetime.now)

    @classmethod
    def getAllSortedByTimestamp(cls):
        return cls.objects.raw({}).order_by(ordering=[("_createdAt", DESCENDING)])

    @classmethod
    def getById(cls, _id):
        return cls.objects.raw({"_id": ObjectId(_id)}).first()

    @classmethod
    def fromDictionary(cls, dictionary):
        kwargs = {"name": dictionary["name"]}
        if "description" in dictionary and dictionary["description"]:
            kwargs["description"] = dictionary["description"]
        if "resultClasses" in dictionary and dictionary["resultClasses"]:
            kwargs["resultClasses"] = [ResultClass.fromDictionary(resultClass)
                                       for resultClass in dictionary["resultClasses"]]
        return Evaluation(**kwargs)

    class Meta:
        indexes = [IndexModel([('name', 1)], unique=True)]