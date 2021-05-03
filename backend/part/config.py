import os
from .util.json import CustomEncoder

config = {
    "ADMIN_USERNAME": "admin",
    "ADMIN_PASSWORD": "123123123u",
    "ADMIN_EMAIL": "sample_email@email.com",
    "JWT_SECRET": "2$7oO9q1v?c>JS\"@ai8t#>e(k8`XP4Aw8${MvTg<k>e2;FMdr%Hej.bSPcw)Q+v",
    "DB_URL": "mongodb://localhost:27017/part-test-2",
    "FILE_UPLOAD_FOLDER": "../../uploadedFiles/"
}

def initConfig():
    for key in config:
        config[key] = os.getenv(key, config[key])

def getFileUploadFolder():
    return config["FILE_UPLOAD_FOLDER"]

class AppConfig(object):
    RESTFUL_JSON = {"cls": CustomEncoder}