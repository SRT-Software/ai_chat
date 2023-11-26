from flask import Blueprint
from flask import Flask, request, jsonify, Response, abort, Blueprint
main = Blueprint('main', __name__)

@main.before_request
def check_token():
    # 获取请求头中的 token
    token = request.headers.get('Access-Control-Request-Headers')
    if token is not None:
        headers = token.split(',')
        if "authorization" not in headers:
            abort(401)  # 返回 401 Unauthorized 错误
    else:
        token = request.headers.get('Authorization')
        if token != 'Bearer test':
            abort(401)  # 返回 401 Unauthorized 错误
    # 校验 token