from flask import make_response as flask_make_response


def makeResponse(body, status=200, headers=None):
    if headers is None:
        headers = {}
    defaultHeaders = {"Content-Type": "application/json"}
    res = flask_make_response(body, status)
    res.headers.extend(defaultHeaders)
    res.headers.extend(headers)
    return res