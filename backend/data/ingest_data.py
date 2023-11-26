from langchain.text_splitter import RecursiveCharacterTextSplitter
from config.prepare import PINECONE_ENVIRONMENT, PINECONE_API_KEY, PINECONE_INDEX_NAME, CHATGLM_KEY
import pinecone
from langchain.document_loaders import PyPDFLoader
import zhipuai
from text_splitter.semantic_segmentation import SemanticTextSplitter
from pymilvus import (
    connections,
    utility,
    FieldSchema,
    CollectionSchema,
    DataType,
    Collection,
)
import os
import json
import subprocess
from flask import Flask, request, jsonify, Blueprint

filePath = '../docs'

milvus_collection_name = "pdf_milvus"

data_path = "data.txt"
meta_path = "meta_path"

chunk_index = 0
file = Blueprint('file', __name__)


def split_list(long_list, chunk_size):
    return [long_list[i:i + chunk_size] for i in range(0, len(long_list), chunk_size)]


def initPinecone():
    try:
        pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENVIRONMENT)
        return pinecone
    except Exception:
        print(Exception)


def initMilvus():
    while True:
        try:
            connections.connect("default", host="localhost", port="19530")
            break
        except Exception as e:
            cmd_command = 'docker-compose down'  # 替换为您要执行的实际CMD命令
            subprocess.run(cmd_command, shell=True, capture_output=True, text=True)
            cmd_command = 'docker-compose up -d'  # 替换为您要执行的实际CMD命令
            subprocess.run(cmd_command, shell=True, capture_output=True, text=True)
    if not utility.has_collection(milvus_collection_name):
        # 向量维度
        vec_dim = 1024
        # metric_type: 向量相似度度量标准, MetricType.IP是向量内积; MetricType.L2是欧式距离
        fields = [
            FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
            FieldSchema(name="embeddings", dtype=DataType.FLOAT_VECTOR, dim=vec_dim),
            FieldSchema(name="metadata", dtype=DataType.VARCHAR, max_length=8192)
        ]

        schema = CollectionSchema(fields, milvus_collection_name)
        pdf_milvus = Collection(milvus_collection_name, schema)
        return pdf_milvus
    else:
        pdf_milvus = Collection(milvus_collection_name)
        return pdf_milvus


@file.route('/file/upload', methods=['POST'])
def upload_file():
    print(request)
    if request.method == 'POST':
        # 检查请求中是否包含文件
        if 'file' not in request.files:
            return 'No file part in the request'

        file = request.files['file']

        # 检查文件名是否为空
        if file.filename == '':
            return 'No selected file'

        # 处理文件上传
        if file:
            filename = filePath + '/' + file.filename
            file.save(filename)  # 保存文件到当前工作目录
        ingest(docs=get_single_file_doc(file), database="milvus")
        response = {
            'msg': 'upload successfully'
        }
        return jsonify(response)
    response = {
        'msg': 'wrong method'
    }
    return jsonify(response)


def get_files_in_directory(directory_path):
    file_list = []
    for root, dirs, files in os.walk(directory_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            file_list.append(file_path)
    return file_list


def get_single_file_doc(path, model="normal"):
    rawDocs = []
    pdfLoader = PyPDFLoader(file_path=path)
    doc = pdfLoader.load()
    for d in doc:
        rawDocs.append(d)

    if model == 'ali':
        textSplitter = SemanticTextSplitter(pdf=True)
    else:
        textSplitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=120)
    docs = textSplitter.split_documents(rawDocs)
    return docs


def getDocs(model="normal"):
    files_list = get_files_in_directory("docs")
    rawDocs = []
    for file in files_list:
        pdfLoader = PyPDFLoader(file_path=file)
        doc = pdfLoader.load()
        for d in doc:
            rawDocs.append(d)
    if model == 'ali':
        textSplitter = SemanticTextSplitter(pdf=True)
    else:
        textSplitter = RecursiveCharacterTextSplitter(chunk_size=120, chunk_overlap=80)
    docs = textSplitter.split_documents(rawDocs)
    return docs


async def ingest(docs, database="milvus"):
    zhipuai.api_key = CHATGLM_KEY
    global chunk_index
    content_list = [chunk.page_content for chunk in docs]
    # print('content', len(content_list))
    # print()
    # 字符embedding后 1024维向量
    embedding_list = []
    for i in range(len(content_list)):
        content = content_list[i]
        try:
            response = zhipuai.model_api.invoke(
                model="text_embedding",
                prompt=content
            )
            if 'data' in response:
                embedding_list.append(response['data']['embedding'])
                index = int(len(embedding_list) * 100 / len(content_list))
                progress = '[' + '=' * index + ' ' * (100 - index) + ']'
                print('\r', progress, f'{index}%', end='', flush=True)
        except Exception as e:
            print(e)
            i -= 1
    with open(data_path, 'a') as file:
        for embedding in embedding_list:
            file.write(f"{embedding}\n")

    tuple_list = []
    metadatas = []
    for i in range(len(embedding_list)):
        metadata = {
            'text': docs[i].page_content,
            'page': docs[i].metadata['page'],
            'source': docs[i].metadata['source']
        }
        d = {
            'id': 'vec' + str(i),
            'values': embedding_list[i],
            'metadata': metadata
        }
        tuple_list.append(d)
        metadatas.append(metadata)
    # 截短 防止太长一次不能插入
    short_lists = split_list(tuple_list, 1000)

    if database == "pinecone":
        pineconeStorage = initPinecone()
        index = pineconeStorage.Index(PINECONE_INDEX_NAME)
        for list in short_lists:
            index.upsert(list)
    elif database == "milvus":
        milvus = initMilvus()
        # 把向量添加到刚才建立的表格中
        # ids可以为None，使用自动生成的id
        json_list = [json.dumps(item) for item in metadatas]
        try:
            entities = [
                embedding_list,  # field embeddings
                json_list,  # field metadata
            ]

            # 确保插入操作成功
            insert_result = milvus.insert(entities)
            print(f"result: {insert_result}")
            # After final entity is inserted, it is best to call flush to have no growing segments left in memory
            milvus.flush()

            # 构建索引
            index = {
                "index_type": "IVF_FLAT",
                "metric_type": "L2",
                "params": {"nlist": 128},
            }
            milvus.create_index("embeddings", index)
            globals()["chunk_index"] += len(embedding_list)
        except Exception as e:
            print(e)


if __name__ == '__main__':
    # connections.connect("default", host="localhost", port="19530")
    files = get_files_in_directory('docs')
    print('start')
    index = 0
    globals()["chunk_index"] = 0
    for file in files:
        if file.endswith('.pdf'):
            print(f"file{index}: {file}, total: {len(files)}")
            doc = get_single_file_doc(file)
            ingest(docs=doc, database="milvus")
        index += 1
