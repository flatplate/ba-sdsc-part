from pymodm import MongoModel, fields
from pymongo import IndexModel

from part.model.util import MongoModelDictionaryConvertible


class Metric(MongoModel, MongoModelDictionaryConvertible):
    name = fields.CharField(required=True)

    class Meta:
        indexes = [IndexModel([('name', 1)], unique=True)]