import zhipuai
from query import match_query
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

QA_TEMPLATE = 'You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.' \
              'If you do not know the answer, just say you do not know. DO NOT try to make up an answer.If the ' \
              'question is not related to the context, politely respond that you are tuned to only answer questions ' \
              'that are related to the context.{}' \
              'Question: {}' \
              'Helpful answer in markdown in Chinese:'

QUES_TEMPLATE = 'make 1 relative question about {}' \
                'you must give me the question instead of solution'


@app.route('/api/data', methods=['POST'])
def chatbot():
    data = request.json
    ques = data.get('question')
    text_list, source_list = match_query(ques, database="milvus")
    response = zhipuai.model_api.sse_invoke(
        model="chatglm_pro",
        prompt=[
            {"role": "user", "content": QA_TEMPLATE.format(text_list, ques)},
        ],
        temperature=0.95,
        top_p=0.7,
        incremental=True
    )
    response = {
        'data': response,
        'source_list': source_list,
        'text_list': text_list,
    }
    json_data = json.dumps(response)

    return json_data


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
    app.run()
