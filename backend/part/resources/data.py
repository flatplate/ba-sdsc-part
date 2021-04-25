import os

from flask_restful import Resource, reqparse
from werkzeug.datastructures import FileStorage
from messytables import any_tableset, headers_guess, type_guess, DateType, DecimalType, StringType, IntegerType

from part.util.response import makeResponse
from ..config import getFileUploadFolder
from uuid import uuid4

typeMap = {
    DateType: "date",
    DecimalType: "numeric",
    StringType: "text",
    IntegerType: "integer",
}

dataTypeRequestParser = reqparse.RequestParser()
dataTypeRequestParser.add_argument('file', type=FileStorage, location="files")

class DataTypeResource(Resource):

    def post(self):
        args = dataTypeRequestParser.parse_args()
        csvfile = args['file']

        tableSet = any_tableset(csvfile)
        rowSet = tableSet.tables[0]

        offset, headers = headers_guess(rowSet.sample)
        types = map(lambda x: typeMap[type(x)], type_guess(rowSet.sample, strict=False))
        data = [{"name": columnName, "type": columnType} for columnName, columnType in zip(headers, types)]
        print(data)

        return makeResponse({
            "data": data
        })


dataUploadRequestParser = reqparse.RequestParser()
dataUploadRequestParser.add_argument('file', type=FileStorage, location="files")

class DataUploadResource(Resource):
    # TODO Change the upload dir
    def post(self):
        args = dataUploadRequestParser.parse_args()
        file = args['file']

        fileUploadFolder = getFileUploadFolder()
        uuid = uuid4()  # Unique ID for the uploaded file, also used as the file name
        savePath = os.path.join(fileUploadFolder, str(uuid))
        file.save(savePath)

        return makeResponse({
            "uploadId": str(uuid)
        })
