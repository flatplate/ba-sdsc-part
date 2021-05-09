from ..config import getFileUploadFolder
from datetime import datetime, timedelta
import os


def deleteOldUploadedFiles():
    for file in os.listdir(getFileUploadFolder()):
        absolutePath = os.path.join(getFileUploadFolder(), file)
        mtime = os.stat(absolutePath).st_mtime
        if datetime.now() - datetime.utcfromtimestamp(mtime) > timedelta(seconds=1):
            # TODO Logging
            print("removing", absolutePath)
            os.remove(absolutePath)