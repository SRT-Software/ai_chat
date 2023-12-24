import sys

sys.path.append("..")
import zhipuai
from data.ingest_data import initPinecone, initMilvus
from config.prepare import PINECONE_INDEX_NAME, CHATGLM_KEY
from log import CustomLogger
import json
import subprocess

logger = CustomLogger("query")

def match_query(ques, database="milvus"):
    zhipuai.api_key = CHATGLM_KEY
    result = zhipuai.model_api.invoke(
        model="text_embedding",
        prompt=ques
    )
    logger.info(f"{result['code']}, {result['msg']}")
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
        times = 0
        while True:
            try:
                milvus = initMilvus()
                milvus.load()
                vectors_to_search = embedding
                search_params = {
                    "metric_type": "L2",
                    "params": {"nprobe": 10},
                }
                logger.info("Search Start")
                results = milvus.search([vectors_to_search], "embeddings", search_params, limit=7,
                                        output_fields=["metadata"])
                logger.info(results)
                for result in results[0]:
                    # print('Vector ID:', result.id, ' Distance:', result.distance, 'Entity:', result.entity)
                    metadata = json.loads(result.entity.get('metadata'))
                    # print(type(metadata), ' ', metadata)
                    text_list.append(metadata['text'])
                    source_list.append((metadata['source'], metadata['page']))
                logger.info("Search Done")
                return text_list, source_list
            except Exception as e:
                logger.error(f"{e}, times:{times}")
                times += 1
                # cmd_command = 'docker-compose down'  # 替换为您要执行的实际CMD命令
                # subprocess.run(cmd_command, shell=True, capture_output=True, text=True)
                # cmd_command = 'docker-compose up -d'  # 替换为您要执行的实际CMD命令
                # subprocess.run(cmd_command, shell=True, capture_output=True, text=True)
                if times >= 10:
                    break
            return [], []

if __name__ == '__main__':
    print('input query')
    query = input()
    match_query(query)
