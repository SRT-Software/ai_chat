import zhipuai
from data.ingest_data import initPinecone, initMilvus
from config.prepare import PINECONE_INDEX_NAME, CHATGLM_KEY

import json
import subprocess


def match_query(ques, database="pinecone"):
    zhipuai.api_key = CHATGLM_KEY
    print('ques:', ques)
    print('key: ', CHATGLM_KEY)
    result = zhipuai.model_api.invoke(
        model="text_embedding",
        prompt=ques
    )
    print(result['code'], result['msg'])
    embedding = result['data']['embedding']
    text_list = []
    source_list = []
    if database == "pinecone":
        p = initPinecone()
        index = p.Index(PINECONE_INDEX_NAME)
        res = index.query(embedding,
                          top_k=4,
                          include_metadata=True,
                          )
        text_list = [text['metadata']['text'] for text in query['matches']]
        source_list = [(text['metadata']['source'], text['metadata']['page']) for text in query['matches']]
        return text_list, source_list
    else:
        while True:
            try:
                milvus = initMilvus()
                milvus.load()
                vectors_to_search = embedding
                search_params = {
                    "metric_type": "L2",
                    "params": {"nprobe": 10},
                }

                results = milvus.search([vectors_to_search], "embeddings", search_params, limit=7,
                                        output_fields=["metadata"])
                for result in results[0]:
                    # print('Vector ID:', result.id, ' Distance:', result.distance, 'Entity:', result.entity)
                    metadata = json.loads(result.entity.get('metadata'))
                    # print(type(metadata), ' ', metadata)
                    text_list.append(metadata['text'])
                    source_list.append((metadata['source'], metadata['page']))
                return text_list, source_list
            except Exception as e:
                cmd_command = 'docker-compose down'  # 替换为您要执行的实际CMD命令
                subprocess.run(cmd_command, shell=True, capture_output=True, text=True)
                cmd_command = 'docker-compose up -d'  # 替换为您要执行的实际CMD命令
                subprocess.run(cmd_command, shell=True, capture_output=True, text=True)
                print(e)


if __name__ == '__main__':
    print('input query')
    query = input()
    match_query(query)
