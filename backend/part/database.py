from pymodm import connect
from .config import config
from .model.user import User
from .authentication import hashAndSalt
from .authentication import verify


def initDatabase():
    connect(config["DB_URL"])
    _initUsers()


def _initUsers():
    # TODO this changes the password if password doesn't match with the config every time it starts, is it good?
    try:
        admin: User = User.objects.raw({"username": config["ADMIN_USERNAME"]}).first()

        if verify(bytes(admin._password), config["ADMIN_PASSWORD"]):
            return
        admin.delete()
    except User.DoesNotExist:
        pass
    admin_pass = hashAndSalt(config["ADMIN_PASSWORD"])
    admin: User = User(username=config["ADMIN_USERNAME"],
                       _password=admin_pass,
                       emailAddress=config["ADMIN_EMAIL"],
                       roles=["admin"])
    print("saving admin")
    admin.save()