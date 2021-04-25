import json
import datetime
from bson.timestamp import Timestamp
from bson.objectid import ObjectId
from messytables import DateType

from part.model.util import DictionaryConvertible


class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return str(obj)
        if isinstance(obj, datetime.date):
            return str(obj)
        if isinstance(obj, Timestamp):
            return self.default(obj.as_datetime())
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, DateType):
            print(obj.format)
            print(obj)
            return "Date"
        return json.JSONEncoder.default(self, obj)