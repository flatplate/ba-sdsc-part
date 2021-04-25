from collections.abc import Iterable, Mapping

from bson import ObjectId
from pymodm.base.models import MongoModelBase, EmbeddedMongoModel, MongoModel


class DictionaryConvertible:
    def __init__(self, *args, **kwargs):
        pass

    def toDictionary(self, omitPrivateFields=True, includeFields=None):
        if includeFields is None:
            includeFields = []
        return self._toDictionary(self, omitPrivateFields, includeFields)

    @classmethod
    def _toDictionary(cls, obj, omitPrivateFields, includeFields):
        if isinstance(obj, (MongoModel, EmbeddedMongoModel)):
            dict_ = {}
            for field in obj._mongometa.get_fields():
                fieldName = field.attname
                if cls.isAllowed(fieldName, omitPrivateFields, includeFields):
                    fieldValue = getattr(obj, fieldName)
                    dict_[fieldName] = cls._toDictionary(fieldValue, omitPrivateFields, includeFields)
            return dict_
        if isinstance(obj, str):
            return obj
        if isinstance(obj, Mapping):
            dict_ = {k: DictionaryConvertible._toDictionary(v, omitPrivateFields, includeFields)
                     for k, v in obj.items()}
            if omitPrivateFields:
                for key in list(dict_.keys()):
                    if key.startswith("_") and key not in includeFields:
                        del dict_[key]
            return dict_
        if isinstance(obj, Iterable):
            return [DictionaryConvertible._toDictionary(item, omitPrivateFields, includeFields) for item in obj]
        if isinstance(obj, DictionaryConvertible):
            return obj.toDictionary(omitPrivateFields=omitPrivateFields)
        return obj

    @staticmethod
    def isAllowed(fieldName: str, omitPrivateFields, includeFields):
        return not (fieldName.startswith("_") and omitPrivateFields) or fieldName in includeFields

class MongoModelDictionaryConvertible(MongoModelBase, DictionaryConvertible):
    """ Do not use this class to inherit MongoModelBase """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
