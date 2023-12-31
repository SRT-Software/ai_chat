import sys
sys.path.append("..")
import time
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from config.prepare import PINECONE_ENVIRONMENT, PINECONE_API_KEY, PINECONE_INDEX_NAME, CHATGLM_KEY
import pinecone
from langchain.document_loaders import PyPDFLoader
import zhipuai
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
from flask import Flask, request, jsonify, Blueprint, make_response
from data.mysql_command import upload_data, delete_table, query_data, store_filename, get_files, query_embedding_index, set_embedding_index
from flask import Flask, request, jsonify, Blueprint
from datetime import datetime
from log import CustomLogger
filePath = 'docs'

milvus_collection_name = "pdf_milvus"

meta_path = "meta_path"

chunk_index = 0
file = Blueprint('file', __name__)
logger = CustomLogger("logger")

def split_list(long_list, chunk_size):
    return [long_list[i:i + chunk_size] for i in range(0, len(long_list), chunk_size)]


def initPinecone():
    try:
        pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENVIRONMENT)
        return pinecone
    except Exception:
        print(Exception)


def initMilvus():
    time = 0
    while True:
        try:
            connections.connect("default", host="standalone", port="19530")
            break
        except Exception as e:
            logger.error(f"{e}")
            time += 1
            if time >= 10:
                break

    if not utility.has_collection(milvus_collection_name):
        # 向量维度
        vec_dim = 1024
        # metric_type: 向量相似度度量标准, MetricType.IP是向量内积; MetricType.L2是欧式距离
        fields = [
            FieldSchema(name="id", dtype=DataType.INT64, is_primary=True),
            FieldSchema(name="embeddings", dtype=DataType.FLOAT_VECTOR, dim=vec_dim),
            FieldSchema(name="metadata", dtype=DataType.VARCHAR, max_length=8192)
        ]

        schema = CollectionSchema(fields, milvus_collection_name)
        pdf_milvus = Collection(milvus_collection_name, schema)
        return pdf_milvus
    else:
        pdf_milvus = Collection(milvus_collection_name)
        return pdf_milvus


def create_audio_docs(audiotext, audiofilepath, model="normal"):
    rawDocs = []
    doc = Document
    doc.page_content = audiotext
    doc.metadata = {
        "page": 0,
        "source": str(datetime.now()).replace(' ', '-') + " audio",
    }
    rawDocs.append(doc)
    textSplitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=120)
    # if model == 'ali':
    #     textSplitter = SemanticTextSplitter(pdf=True)
    # else:
    #     textSplitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=120)
    docs = textSplitter.split_documents(rawDocs)
    return docs


@file.route('/file/upload', methods=['POST'])
def upload_file():
    def saveFile(postfile, path):
        # 检查文件夹是否存在
        if not os.path.exists(filePath):
            # 如果文件夹不存在，则创建
            os.makedirs(filePath)
        postfile.save(path)  # 保存文件到当前工作目录
        docs = get_single_file_doc(path)
        logger.info(f"len: {len(docs)}")
        os.remove(path) # 删除文件

        if len(docs) == 0:
            error = make_response('file is empty')
            error.status = 400
            return error
        try:
            ingest(docs=docs, filename=path, database="milvus")
        except e:
            error2 = make_response(f'{e}')
            error2.status = 400
            return error2
    if request.method == 'POST':
        # 检查请求中是否包含文件
        logger.info(f"file: {request.files}")
        if 'file' not in request.files:
            return 'No file part in the request'

        file = request.files['file']

        # 检查文件名是否为空
        if file.filename == '':
            return 'No selected file'

        # 处理文件上传
        if file:
            filepath = str(filePath + '/' + file.filename)
            try:
                saveFile(file, filepath)
                response = {
                    'msg': 'upload successfully'
                }
                return jsonify(response)
            except Exception as e:
                logger.error(e)
                error = make_response(f'{e}')
                error.status = 400
                return error
    response = {
        'msg': 'wrong method'
    }
    return jsonify(response)


@file.route('/file/audio', methods=['POST'])
def upload_audio():
    def saveFile(audiotext, audiofilepath):
        ingest(docs=create_audio_docs(audiotext, audiofilepath), filename=audiofilepath, database="milvus")

    if request.method == 'POST':
        # 检查请求中是否包含文件
        data = request.json
        text = data.get('text')
        current_time = datetime.now()
        # 创建 PDF 文件
        filepath = str(filePath + '/' + str(current_time).replace(' ', '-')) + ".pdf"

        saveFile(text, filepath)
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

    textSplitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=120)
    # if model == 'ali':
    #     textSplitter = SemanticTextSplitter(pdf=True)
    # else:
    #     textSplitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=120)
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
    textSplitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=120)
    # if model == 'ali':
    #     textSplitter = SemanticTextSplitter(pdf=True)
    # else:
    #     textSplitter = RecursiveCharacterTextSplitter(chunk_size=120, chunk_overlap=80)
    docs = textSplitter.split_documents(rawDocs)
    return docs


def ingest(docs, filename, database="milvus"):
    zhipuai.api_key = CHATGLM_KEY
    isEmpty = True
    for doc in docs:
        if doc.page_content != '':
            isEmpty = False

    if isEmpty or len(docs) == 0:
        raise Exception("file is empty")

    logger.info("Start Embedding")
    global chunk_index
    content_list = [chunk.page_content for chunk in docs]
    # 字符embedding后 1024维向量
    embedding_list = []
    times = 0
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
                # logger.info(f"{index}%")
                print('\r', progress, f'{index}%', end='', flush=True)
                times = 0
        except Exception as e:
            logger.error(e)
            time.sleep(1)
            i -= 1
            times += 1
            if(times >= 10):
                raise "Can't Connect with LLM"

    tuple_list = []
    metadatas = []
    logger.info("Start Make Metadatas")
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
        logger.info("milvus ingest")
        milvus = initMilvus()
        # 把向量添加到刚才建立的表格中
        # ids可以为None，使用自动生成的id
        json_list = [json.dumps(item) for item in metadatas]
        globals()["chunk_index"] = query_embedding_index()
        ids = [i + globals()["chunk_index"] for i in range(len(json_list))]
        try:
            entities = [
                ids,
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
            table_name = filename
            r = upload_data(filename=table_name, ids=ids)
            if r is None:
                raise 'Name Error'
            set_embedding_index(len(embedding_list))

        except Exception as e:
            logger.info(e)

def make_expr(filename):
    matches = query_data(filename)
    ids = []
    for match in matches:
        ids.append(int(match[0]))
    print(ids)
    return f'id in {ids}'

@file.route('/file/delete', methods=['POST'])
def deleteFile():
    if request.method == 'POST':
        data = request.json
        filename = data.get('filename')
        expr = make_expr(str(filename[0]))
        collection = initMilvus()
        collection.delete(expr)
        delete_table(filename=filename[0])
        logger.info(f"Delete File: {filename[0]}")
        return make_response("delete complete")

@file.route('/file/getfiles', methods=['GET'])
def get_uploaded_files():
    if request.method == 'GET':
        files = get_files()
        logger.info(files)
        response = {
            'filenames': files
        }
        # logger.info(f"Get Files {files}")
        return jsonify(response)


if __name__ == '__main__':
    # connections.connect("default", host="localhost", port="19530")
    # files = get_files_in_directory('docs')
    print('start')
    # index = 0
    # globals()["chunk_index"] = 0
    # for file in files:
    #     if file.endswith('.pdf'):
    #         print(f"file{index}: {file}, total: {len(files)}")
    #         doc = get_single_file_doc(file)
    #         ingest(docs=doc, database="milvus")
    #     index += 1
