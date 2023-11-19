import zhipuai
from query import match_query
import json
from flask import Flask, request, jsonify, Response, abort
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

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



@app.route('/api/data', methods=['POST', 'OPTIONS'])
def chatbot():
    if request.method == 'OPTIONS':
        return app.make_default_options_response()
    else:
        data = request.json
        print(data)
        ques = data.get('question')
        if ques != "":
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

            def generate():
                for event in sse_data.events():
                    yield f"{event.data}"

            return Response(generate(), mimetype='text/event-stream')
        else:
            def generate():
                for i in range(2):
                    yield f""
            return Response(generate(), mimetype='text/event-stream')


@app.route('/api/source', methods=['GET'])
def get_sources():
    response = {
        'texts': globals()['text_list'],
        'sources': globals()['source_list'],
    }
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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
