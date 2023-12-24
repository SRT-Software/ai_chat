import sys

sys.path.append("..")
import zhipuai
from chat.query import match_query
import json
from flask import Flask, request, jsonify, Response, abort, Blueprint
from flask_cors import CORS
from log import CustomLogger
from config.prepare import CHATGLM_KEY

text_list = []
source_list = []

QA_TEMPLATE = 'You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.' \
              'If you do not know the answer, just say you do not know. DO NOT try to make up an answer.If the ' \
              'question is not related to the context, politely respond that you are tuned to only answer questions ' \
              'that are related to the context.{}' \
              'Question: {}' \
              'Helpful answer in markdown in Chinese:'

QUES_TEMPLATE = 'make 1 relative question about {}' \
                'you must give me the question instead of solution'

main = Blueprint('main', __name__)
logger = CustomLogger("logger")

@main.route('/api/data', methods=['POST', 'OPTIONS'])
def chatbot():
    zhipuai.api_key = CHATGLM_KEY
    if request.method == 'OPTIONS':
        return "Options"
    else:
        data = request.json
        ques = data.get('question')
        if ques != "":
            logger.info(f"Data: {data}")
            globals()["text_list"], globals()["source_list"] = match_query(ques, database="milvus")
            sse_data = zhipuai.model_api.sse_invoke(
                model="chatglm_pro",
                prompt=[
                    {"role": "user", "content": QA_TEMPLATE.format(text_list, ques)},
                ],
                temperature=0.95,
                top_p=0.7,
                incremental=True
            )
            logger.info(f"Get Answer Back")
            def generate():
                for event in sse_data.events():
                    yield f"{event.data}"

            return Response(generate(), mimetype='text/event-stream')
        else:
            def generate():
                for i in range(2):
                    yield f""

            return Response(generate(), mimetype='text/event-stream')


@main.route('/api/source', methods=['GET'])
def get_sources():
    response = {
        'texts': globals()['text_list'],
        'sources': globals()['source_list'],
    }
    logger.info(f"Source: {globals()['source_list']}")
    return jsonify(response)


def relative_ques(ques):
    response = zhipuai.model_api.sse_invoke(
        model="chatglm_turbo",
        prompt=[
            {"role": "user", "content": QUES_TEMPLATE.format(ques)},
        ],
        temperature=0.95,
        top_p=0.7,
        incremental=True
    )
    data = ''
    for event in response.events():
        data += event.data
    # print(data)
    return data
