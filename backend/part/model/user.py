from bson import ObjectId
from pymodm import MongoModel, EmbeddedMongoModel, fields
from pymongo import IndexModel
from datetime import datetime
from uuid import uuid4, UUID


class User(MongoModel):
    username = fields.CharField()
    _password = fields.BinaryField()
    emailAddress = fields.CharField()
    createdAt = fields.DateTimeField(default=datetime.now)
    roles = fields.ListField(field=fields.CharField())
    id = fields.UUIDField(default=uuid4)
    _invalidateAt = fields.DateTimeField(default=datetime.now)

    @classmethod
    def getById(cls, uid):
        return cls.objects.raw({"id": UUID(uid)}).first()

    class Meta:
        indexes = [IndexModel([('username', 1)], unique=True),
                   IndexModel([('emailAddress', 1)], unique=True),
                   IndexModel([('id', 1)], unique=True)]

