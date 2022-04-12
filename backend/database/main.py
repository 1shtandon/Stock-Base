import os.path

import mysql.connector


class MysqlConnection:
    def __init__(self, host, user, password, database):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self._connection = None

    @property
    def connection(self):
        return self.get_connection()

    def get_connection(self):
        if not self._connection or not self._connection.is_connected():
            self.connect()
        return self._connection

    def connect(self):
        self._connection = mysql.connector.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database
        )
        return self._connection

    def close(self):
        if self._connection and self._connection.is_connected():
            self._connection.close()
        self._connection = None

    def execute(self, query, params=None):
        cursor = self.get_connection().cursor()
        cursor.execute(query, params)
        self.get_connection().commit()
        return cursor

    def execute_many(self, query, params=None):
        cursor = self.get_connection().cursor()
        cursor.executemany(query, params)
        self.get_connection().commit()
        return cursor

    def fetch_all(self, query, params=None):
        cursor = self.get_connection().cursor()
        cursor.execute(query, params)
        return cursor.fetchall()

    def fetch_one(self, query, params=None):
        cursor = self.get_connection().cursor()
        cursor.execute(query, params)
        return cursor.fetchone()

    def create_tables(self):
        file_path = os.path.join(
            os.path.dirname(__file__),
            '..',
            'sql_queries',
            'create.sql'
        )
        with open(file_path, 'r') as f:
            query = f.read()
        self.execute(query)

    def last_insert_id(self):
        cursor = self.get_connection().cursor()
        cursor.execute('SELECT LAST_INSERT_ID()')
        return cursor.fetchone()[0]
