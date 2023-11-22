"""
DB 커넥션 관리
"""
import mysql.connector.pooling
import dotenv
import os

dotenv_file = dotenv.find_dotenv()
dotenv.load_dotenv(dotenv_file)

def get_pool_conn():
    config = {

        'user':  'root'
        , 'password': 'kpst1234'
        , 'host':  '211.46.241.212'
        , 'port': '31945'
        , 'database': 'Autonomous_driving'
                }
    # Mariadb 커넥션 풀 설정
    mariadb_pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **config)
    return mariadb_pool