from flask import Flask, request, jsonify, Response, abort, Blueprint
from view.main import main
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
app.register_blueprint(main)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
