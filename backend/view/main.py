from flask import Blueprint
from flask import Flask, request, jsonify, Response, abort, Blueprint
main = Blueprint('api', __name__, url_prefix='/api')