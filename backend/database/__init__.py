import os

from database.main import MysqlConnection
from dotenv import load_dotenv

load_dotenv()

mysql_connection = MysqlConnection(
    host=os.environ['MYSQL_HOST'],
    user=os.environ['MYSQL_USER'],
    password=os.environ['MYSQL_PASSWORD'],
    database=os.environ['MYSQL_DATABASE']
)
