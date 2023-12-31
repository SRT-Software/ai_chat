import sys
sys.path.append("..")
import hashlib
import time
import mysql.connector
from mysql.connector import errorcode
from config.prepare import DATABASE_NAME, PASSWORD
from log import CustomLogger

DB_NAME = DATABASE_NAME

config = {
    "host": "mysql",
    "user": 'root',
    "password": PASSWORD,
}

DEFAULT_NAME = 'DEFAULT_FILES'
DEFAULT_INDEX_TABLE = 'DEFAULT_INDEX_TABLE'
logger = CustomLogger("logger")

def connect_to_mysql(config, attempts=3, delay=2):
    attempt = 1
    # Implement a reconnection routine
    while attempt < attempts + 1:
        try:
            cnx = mysql.connector.connect(**config)
            cursor = cnx.cursor()
            try:
                cursor.execute("USE {}".format(DB_NAME))
            except mysql.connector.Error as err:
                print("Database {} does not exists.".format(DB_NAME))
                if err.errno == errorcode.ER_BAD_DB_ERROR:
                    create_database(cursor)
                    print("Database {} created successfully.".format(DB_NAME))
                    cnx.database = DB_NAME
                else:
                    print(err)
            return cnx
        except (mysql.connector.Error, IOError) as err:
            if (attempts is attempt):
                # Attempts to reconnect failed; returning None
                logger.info("Failed to connect, exiting without a connection: %s", err)
                return None
            logger.info(
                "Connection failed: %s. Retrying (%d/%d)...",
                err,
                attempt,
                attempts - 1,
            )
            # progressive reconnect delay
            time.sleep(delay ** attempt)
            attempt += 1
    return None


def create_database(cursor):
    try:
        cursor.execute(
            "CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(DB_NAME))
    except mysql.connector.Error as err:
        print("Failed creating database: {}".format(err))


def create_table(table_name):
    cnx = connect_to_mysql(config)
    cursor = cnx.cursor()
    TABLES = {}
    TABLES[table_name] = (
        f"CREATE TABLE `{table_name}` ("
        "  `emp_no` int(11) NOT NULL,"
        "  `id` VARCHAR(10) NOT NULL,"
        "  PRIMARY KEY (`emp_no`)"
        ") ENGINE=InnoDB")

    for table_name in TABLES:
        table_description = TABLES[table_name]
        try:
            print("Creating table {}: ".format(table_name), end='')
            cursor.execute(table_description)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                print("already exists.")
            else:
                print(err.msg)
        else:
            print("OK")

    cursor.close()
    cnx.close()


def store_data(table_name, ids):
    cnx = connect_to_mysql(config)
    cursor = cnx.cursor()
    add_id = (f"INSERT INTO `{table_name}` "
              "(emp_no, id) "
              "VALUES (%(emp_no)s, %(id)s)")

    emp_no = cursor.lastrowid
    for id in ids:
        if (cursor.lastrowid == None):
            emp_no = 0
        data_id = {
            'emp_no': emp_no,
            'id': id,
        }

        cursor.execute(add_id, data_id)
        emp_no = emp_no + 1

    # Make sure data is committed to the database
    cnx.commit()

    cursor.close()
    cnx.close()


def filename_to_tablename(filename):
    hash_obj = hashlib.sha1(filename.encode())
    return hash_obj.hexdigest()[:15]


def upload_data(filename, ids):
    table_name = filename_to_tablename(filename)
    print("table name: " ,table_name)
    if table_name == DEFAULT_NAME:
        return None
    else:
        print('delete')
        delete_table(filename)
        print("create")
        create_table(table_name)
        print("store filename")
        store_filename(filename)
        print("store data")
        store_data(table_name, ids)
        return 'ok'


def query_data(filename):
    table_name = filename_to_tablename(filename)
    cnx = connect_to_mysql(config)
    cursor = cnx.cursor()

    query = (f"SELECT id FROM `{table_name}` ")

    cursor.execute(query)
    ids = []
    for (id) in cursor:
        ids.append(id)
    cursor.close()
    cnx.close()
    return ids


def delete_table(filename):
    cnx = connect_to_mysql(config)
    cursor = cnx.cursor()
    # 查询表是否存在的 SQL 语句
    show_tables_query = "SHOW TABLES LIKE %s"
    table_name = filename_to_tablename(filename)
    cursor.execute(show_tables_query, (table_name,))
    # 获取查询结果
    result = cursor.fetchone()

    # 检查表是否存在
    if result:
        # 删除表的 SQL 语句
        drop_table_query = f"DROP TABLE `{table_name}`"
        # 执行删除表的 SQL 语句
        cursor.execute(drop_table_query)
        print("delete filename")
        # 查询特定值是否存在
        query = f"SELECT * FROM `{DEFAULT_NAME}` WHERE filename = %s"
        value = (filename,)
        cursor.execute(query, value)

        # 检查查询结果
        if cursor.fetchone():
            # 如果存在，执行删除操作
            delete_sql = f"DELETE FROM `{DEFAULT_NAME}` WHERE filename = %s"
            cursor.execute(delete_sql, (filename,))
    else:
        print("表不存在")

    # 提交事务
    cnx.commit()

    # 关闭游标和连接
    cursor.close()
    cnx.close()


def store_filename(filename):
    cnx = connect_to_mysql(config)
    cursor = cnx.cursor()
    # 查询表是否存在的 SQL 语句
    show_tables_query = "SHOW TABLES LIKE %s"
    cursor.execute(show_tables_query, (DEFAULT_NAME,))
    # 获取查询结果
    result = cursor.fetchone()
    if not result:
        TABLES = {}
        TABLES[DEFAULT_NAME] = (
            f"CREATE TABLE `{DEFAULT_NAME}` ("
            "  `emp_no` int(11) NOT NULL,"
            "  `filename` VARCHAR(128) NOT NULL,"
            "  PRIMARY KEY (`emp_no`)"
            ") ENGINE=InnoDB")

        for table_name in TABLES:
            table_description = TABLES[table_name]
            try:
                print("Creating table {}: ".format(table_name), end='')
                cursor.execute(table_description)
            except mysql.connector.Error as err:
                if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                    print("already exists.")
                else:
                    print(err.msg)
            else:
                print("OK")

    add_id = (f"INSERT INTO `{DEFAULT_NAME}` "
              "(emp_no, filename) "
              "VALUES (%(emp_no)s, %(filename)s)")

    emp_no = 0
    # 定义查询最大emp_no的SQL语句
    query = f"SELECT MAX(emp_no) FROM `{DEFAULT_NAME}`"
    # 执行查询
    cursor.execute(query)
    # 获取查询结果
    result = cursor.fetchone()
    # 提取最大emp_no值
    max_emp_no = result[0]
    print(max_emp_no)
    if (max_emp_no == None):
        emp_no = 0
    else:
        emp_no = max_emp_no + 1
    data_id = {
        'emp_no': emp_no,
        'filename': filename,
    }
    print(data_id)
    cursor.execute(add_id, data_id)
    # Make sure data is committed to the database
    cnx.commit()

    cursor.close()
    cnx.close()


def get_files():
    cnx = connect_to_mysql(config)
    cursor = cnx.cursor()

    show_tables_query = "SHOW TABLES LIKE %s"
    cursor.execute(show_tables_query, (DEFAULT_NAME,))
    # 获取查询结果
    result = cursor.fetchone()
    if result:
        query = (f"SELECT filename FROM `{DEFAULT_NAME}` ")

        cursor.execute(query)
        filenames = []
        for (filename) in cursor:
            filenames.append(filename)
        cursor.close()
        cnx.close()
        return filenames
    else:
        return []

def set_embedding_index(num):
    cnx = connect_to_mysql(config)
    cursor = cnx.cursor()
    # 查询表是否存在的 SQL 语句
    show_tables_query = "SHOW TABLES LIKE %s"
    cursor.execute(show_tables_query, (DEFAULT_INDEX_TABLE,))
    # 获取查询结果
    result = cursor.fetchone()
    if not result:
        TABLES = {}
        TABLES[DEFAULT_INDEX_TABLE] = (
            f"CREATE TABLE `{DEFAULT_INDEX_TABLE}` ("
            "  `emp_no` int(11) NOT NULL,"
            "  `idx` int(11) NOT NULL,"
            "  PRIMARY KEY (`emp_no`)"
            ") ENGINE=InnoDB")

        for table_name in TABLES:
            table_description = TABLES[table_name]
            try:
                print("Creating table {}: ".format(table_name), end='')
                cursor.execute(table_description)
            except mysql.connector.Error as err:
                if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                    print("already exists.")
                else:
                    print(err.msg)
            else:
                print("OK")

    # 查询emp_no为0的行
    query = f"SELECT * FROM `{DEFAULT_INDEX_TABLE}` WHERE emp_no = 0"
    cursor.execute(query)

    # 检查查询结果
    row = cursor.fetchone()  # 获取一行结果
    if row is None:
        # 如果不存在emp_no为0的行，则插入新行
        insert_query = f"INSERT INTO `{DEFAULT_INDEX_TABLE}` (emp_no, idx) VALUES (0, {num})"
        cursor.execute(insert_query)
    else:
        # 如果存在emp_no为0的行，则更新value值加10
        update_query = f"UPDATE `{DEFAULT_INDEX_TABLE}` SET idx = idx + {num} WHERE emp_no = 0"
        cursor.execute(update_query)
    # Make sure data is committed to the database
    cnx.commit()
    cursor.close()
    cnx.close()


def query_embedding_index():
    cnx = connect_to_mysql(config)
    cursor = cnx.cursor()
    # 查询表是否存在的 SQL 语句
    show_tables_query = "SHOW TABLES LIKE %s"
    cursor.execute(show_tables_query, (DEFAULT_INDEX_TABLE,))
    # 获取查询结果
    result = cursor.fetchone()
    if not result:
        TABLES = {}
        TABLES[DEFAULT_INDEX_TABLE] = (
            f"CREATE TABLE `{DEFAULT_INDEX_TABLE}` ("
            "  `emp_no` int(11) NOT NULL,"
            "  `idx` int(11) NOT NULL,"
            "  PRIMARY KEY (`emp_no`)"
            ") ENGINE=InnoDB")

        for table_name in TABLES:
            table_description = TABLES[table_name]
            try:
                print("Creating table {}: ".format(table_name), end='')
                cursor.execute(table_description)
            except mysql.connector.Error as err:
                if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                    print("already exists.")
                else:
                    print(err.msg)
            else:
                print("OK")

    # 查询emp_no为0的行，并返回index的值
    query = f"SELECT idx FROM {DEFAULT_INDEX_TABLE} WHERE emp_no = 0"
    cursor.execute(query)

    # 获取查询结果
    index_value = 0
    result = cursor.fetchone()  # 获取一行结果
    if result is not None:
        index_value = result[0]
        print("The idx value for emp_no=0 is:", index_value)
    else:
        print("No rows found for emp_no=0")

    # 关闭游标和数据库连接
    cursor.close()
    cnx.close()
    return index_value

if __name__ == '__main__':
    print(DATABASE_NAME)
    delete_table('test')
    upload_data('test', ["111", '222', '333'])
    print(query_data('test'))
    delete_table('test')
    print(query_embedding_index())
    set_embedding_index(20)
    print(query_embedding_index())