import logging
import time
import mysql.connector
from mysql.connector import errorcode
# Set up logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")

# Log to console
handler = logging.StreamHandler()
handler.setFormatter(formatter)
logger.addHandler(handler)

# Also log to a file
file_handler = logging.FileHandler("cpy-errors.log")
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

DB_NAME = 'embedding'
USER_NAME = 'user'

config = {
    "host": "localhost",
    "user": "new_user",
    "password": "password",
}



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
    add_id = (f"INSERT INTO {table_name}"
                "(emp_no, id) "
                "VALUES (%(emp_no)s, %(id)s)"
                "ON DUPLICATE KEY UPDATE "
                "id = VALUES(id)")

    emp_no = cursor.lastrowid
    for id in ids:
        print(emp_no)
        if(cursor.lastrowid == None):
            emp_no = 0
        data_id = {
            'emp_no': emp_no,
            'id': id,
        }
        print(data_id)
        cursor.execute(add_id, data_id)
        emp_no = emp_no + 1

    # Make sure data is committed to the database
    cnx.commit()

    cursor.close()
    cnx.close()


def upload_data(filename, ids):
    delete_table(filename)
    create_table(filename)
    store_data(filename, ids)


def query_data(filename):
    cnx = connect_to_mysql(config)
    cursor = cnx.cursor()

    query = (f"SELECT id FROM {filename} ")

    cursor.execute(query)
    ids = []
    for (id) in cursor:
        print("id: ", id)
        ids.append(id)
    cursor.close()
    cnx.close()
    return ids

def delete_table(filename):
    cnx = connect_to_mysql(config)
    cursor = cnx.cursor()
    # 查询表是否存在的 SQL 语句
    show_tables_query = "SHOW TABLES LIKE %s"
    cursor.execute(show_tables_query, (filename,))
    # 获取查询结果
    result = cursor.fetchone()

    # 检查表是否存在
    if result:
        # 删除表的 SQL 语句
        drop_table_query = f"DROP TABLE {filename}"
        # 执行删除表的 SQL 语句
        cursor.execute(drop_table_query)
    else:
        print("表不存在")

    # 提交事务
    cnx.commit()

    # 关闭游标和连接
    cursor.close()
    cnx.close()

def

if __name__ == '__main__':
    delete_table('test')
    upload_data('test', ["111", '222', '333'])
    print(query_data('test'))
    delete_table('test')

