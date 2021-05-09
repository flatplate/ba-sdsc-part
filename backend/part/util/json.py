import json
import datetime
from uuid import UUID

from bson.timestamp import Timestamp
from bson.objectid import ObjectId
from messytables import DateType


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
        if isinstance(obj, UUID):
            return str(obj)
        return json.JSONEncoder.default(self, obj)