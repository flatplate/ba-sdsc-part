from pymodm import connect
from .config import config
from .model.user import User
from .authentication import hashAndSalt
from .authentication import verify


def initDatabase():
    connect(config["DB_URL"])
    _initUsers()


def _initUsers():
    try:
        User.objects.raw({"username": config["ADMIN_USERNAME"]}).first()
        return
    except User.DoesNotExist:
        pass
    adminPass = hashAndSalt(config["ADMIN_PASSWORD"])
    admin: User = User(username=config["ADMIN_USERNAME"],
                       _password=adminPass,
                       emailAddress=config["ADMIN_EMAIL"],
                       roles=["admin"])
    print("saving admin")
    admin.save()