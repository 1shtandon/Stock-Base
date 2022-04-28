# import os
#
# import mysql.connector
#
# from dotenv import load_dotenv
#
# load_dotenv()
#
# connection = mysql.connector.connect(
#     host=os.environ['MYSQL_HOST'],
#     user=os.environ['MYSQL_USER'],
#     password=os.environ['MYSQL_PASSWORD'],
#     database=os.environ['MYSQL_DATABASE']
# )
#
# cursor = connection.cursor()
# cursor.execute("SELECT * FROM user_table")
# print(cursor.fetchone())
# print(cursor.fetchone())
# print(cursor.fetchone())

