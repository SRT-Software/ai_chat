from flask import Flask, request, jsonify, Response, abort, Blueprint
from view.main import main
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
app.register_blueprint(main)


@app.before_request
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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
