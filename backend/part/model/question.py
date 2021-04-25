import collections

from bson import ObjectId
from pymodm import MongoModel, EmbeddedMongoModel, fields
from pymongo import IndexModel, DESCENDING
from datetime import datetime

from part.evaluation.data import dataEvaluationStrategies
from part.model.metric import Metric
from part.model.util import MongoModelDictionaryConvertible

questionTypes = {}


def questionType(questionTypeString):
    def questionTypeDecorator(cls):
        questionTypes[questionTypeString] = cls
        return cls

    return questionTypeDecorator


class MetricEffect(EmbeddedMongoModel, MongoModelDictionaryConvertible):
    metric = fields.ReferenceField(Metric)
    weight = fields.FloatField()
    strategy = fields.CharField()

    @classmethod
    def fromDictionary(cls, dictionary):
        print("Meto ", dictionary)
        print("MetricDict", dictionary)
        metric = Metric.objects.raw({"name": dictionary["metric"]["name"]}).first()
        return MetricEffect(metric=metric, weight=dictionary["weight"], strategy=dictionary["strategy"])


class MetricEffectGroup(EmbeddedMongoModel, MongoModelDictionaryConvertible):
    fieldName = fields.CharField()
    metricEffects = fields.EmbeddedDocumentListField(MetricEffect)

    @classmethod
    def fromDictionary(cls, dictionary):
        kwargs = {"fieldName": dictionary["fieldName"]}
        if "metricEffects" in dictionary and dictionary["metricEffects"]:
            kwargs["metricEffects"] = [MetricEffect.fromDictionary(metricEffect) for metricEffect in
                                       dictionary["metricEffects"]]

        return MetricEffectGroup(**kwargs)


class Question(MongoModel, MongoModelDictionaryConvertible):
    _name = fields.CharField()
    text = fields.CharField()
    _createdAt = fields.TimestampField(default=datetime.now)
    type = fields.CharField(default="BaseQuestion")
    tooltip = fields.CharField()
    _metricEffects = fields.EmbeddedDocumentListField(MetricEffectGroup)

    class Meta:
        indexes = [IndexModel([('_name', 1)], unique=True)]

    @classmethod
    def getAllSortedByTimestamp(cls):
        return cls.objects.raw({}).order_by(ordering=[("_createdAt", DESCENDING)])


class Answer(EmbeddedMongoModel):
    text = fields.CharField()
    value = fields.CharField()
    tooltip = fields.CharField()
    numericalValue = fields.FloatField(default=0)
    type = fields.CharField(default="text")


# No question type decorator because this is just an internal type
class AnswerQuestion(Question):
    answers = fields.ListField(field=fields.EmbeddedDocumentField(Answer))


@questionType("Single Answer Question")
class SingleAnswerQuestion(AnswerQuestion):
    type = fields.CharField(default="Single Answer Question")


@questionType("Single Answer Question With Other")
class SingleAnswerQuestionWithOther(AnswerQuestion):
    type = fields.CharField(default="Single Answer Question With Other")


@questionType("Multiple Answer Question")
class MultipleAnswerQuestion(AnswerQuestion):
    type = fields.CharField(default="Multiple Answer Question")


@questionType("Multiple Answer Question With Other")
class MultipleAnswerQuestionWithOther(AnswerQuestion):
    type = fields.CharField(default="Multiple Answer Question With Other")


@questionType("Multiple Answer Ordered Question")
class MultipleAnswerOrderedQuestion(AnswerQuestion):
    type = fields.CharField(default="Multiple Answer Ordered Question")


@questionType("Multiple Answer Ordered Question With Other")
class MultipleAnswerOrderedQuestionWithOther(AnswerQuestion):
    type = fields.CharField(default="Multiple Answer Ordered Question With Other")


@questionType("Data Question")
class DataQuestion(Question):
    type = fields.CharField(default="DataQuestion")
    evaluationStrategy = fields.CharField(required=True)


@questionType("Contact Form Question")
class ContactFormQuestion(AnswerQuestion):
    type = fields.CharField(default="Contact Form Question")


class MatrixQuestionRow(EmbeddedMongoModel):
    text = fields.CharField()
    id = fields.CharField()


@questionType("Matrix Question")
class MatrixQuestion(AnswerQuestion):
    type = fields.CharField(default="Matrix Question")
    rows = fields.ListField(field=fields.EmbeddedDocumentField(MatrixQuestionRow))


def clean(toClean):
    if type(toClean) is list:
        return [clean(element) for element in toClean]
    if not isinstance(toClean, collections.Mapping):
        return toClean
    cleanedDictionary = {}
    for key, value in toClean.items():
        if key in ["_id", "_cls"]:
            continue
        if not value and not isinstance(value, bool):
            continue
        cleanedDictionary[key] = clean(value)
        print(cleanedDictionary)
    return cleanedDictionary


def fromDictionary(rawDictionary):
    dictionary = clean(rawDictionary)
    print(dictionary)
    questionClass = questionTypes[dictionary["type"]]
    if questionClass is DataQuestion and rawDictionary["evaluationStrategy"] not in dataEvaluationStrategies:
        raise Exception("Data evaluation strategy not found")
    answers = []
    rows = []
    metricEffects = []
    if "answers" in dictionary and dictionary["answers"]:
        answers = [Answer(**answer) for answer in dictionary["answers"]]
    if "rows" in dictionary and dictionary["rows"]:
        rows = [MatrixQuestionRow(**row) for row in dictionary["rows"]]
    if "_metricEffects" in dictionary and dictionary["_metricEffects"]:
        metricEffects = [MetricEffectGroup.fromDictionary(metricEffect) for metricEffect in
                         dictionary["_metricEffects"]]
    kwargs = {
        **dictionary,
        "answers": answers,
        "rows": rows,
        "_metricEffects": metricEffects
    }

    if not issubclass(questionClass, AnswerQuestion):
        del kwargs["answers"]
    if not issubclass(questionClass, MatrixQuestion):
        del kwargs["rows"]
    if not issubclass(questionClass, DataQuestion) and "evaluationStrategy" in kwargs:
        del kwargs["evaluationStrategy"]
    if not metricEffects:
        del kwargs["_metricEffects"]
    return questionClass(**kwargs)


def fromName(name):
    try:
        return Question.objects.raw({"name": name}).first()
    except Question.DoesNotExist:
        return None


def fromId(questionId):
    questionObjectId = ObjectId(questionId)
    try:
        return Question.objects.raw({"_id": questionObjectId}).first()
    except Question.DoesNotExist:
        return None
