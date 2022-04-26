from typing import Optional, Union

import mysql.connector

from database import mysql_connection, MysqlConnection
from util import CustomSerializable


class UsernameAlreadyExists(Exception):
    pass


class EmailAlreadyExists(Exception):
    pass


class UserManager:
    def __init__(self):
        self.mysql_connection: MysqlConnection = mysql_connection

    def get_admin(self, username: Union[int, str]) -> Optional['User']:
        try:
            if isinstance(username, int):
                user_data = self.mysql_connection.fetch_all(
                    'SELECT admin_id, username, email FROM admin_table WHERE admin_id = %s',
                    (username,)
                )
            else:
                user_data = self.mysql_connection.fetch_all(
                    'SELECT admin_id, username, email FROM admin_table WHERE username = %s',
                    (username,)
                )
            if len(user_data) == 0:
                return None
            user_data, = user_data
            return User(
                user_id=user_data[0],
                username=user_data[1],
                email=user_data[2],
                age=None,
                first_name=None,
                last_name=None,
                is_admin=True,
            )
        except Exception as e:
            raise e

    def get_user(self, username: Union[int, str]) -> Optional['User']:
        try:
            if isinstance(username, int):
                user_data = self.mysql_connection.fetch_all(
                    'SELECT user_id, username, email, age, first_name, last_name FROM user_table WHERE user_id = %s',
                    (username,)
                )
            else:
                user_data = self.mysql_connection.fetch_all(
                    'SELECT user_id, username, email, age, first_name, last_name FROM user_table WHERE username = %s',
                    (username,)
                )
            if len(user_data) == 0:
                return None
            user_data, = user_data
            return User(
                user_id=user_data[0],
                username=user_data[1],
                email=user_data[2],
                age=user_data[3],
                first_name=user_data[4],
                last_name=user_data[5],
                is_admin=False,
            )
        except Exception as e:
            raise e

    def authenticate_user(self, username: str, password: str, admin=False) -> Optional['User']:
        try:
            if not admin:
                user_data = self.mysql_connection.fetch_all(
                    'SELECT user_id, username, password FROM user_table WHERE username = %s or email = %s',
                    (username, username)
                )
            else:
                user_data = self.mysql_connection.fetch_all(
                    'SELECT admin_id, username, password FROM admin_table WHERE username = %s or email = %s',
                    (username, username)
                )
            if len(user_data) == 0:
                return None
            user_data, = user_data
            if user_data[2] == password:
                if not admin:
                    return self.get_user(user_data[0])
                else:
                    return self.get_admin(user_data[0])
            return None
        except Exception as e:
            raise e

    def create_admin(
            self,
            username: str,
            password: str,
            email: str,
    ) -> 'User':
        try:
            self.mysql_connection.execute(
                'Insert into admin_table (username, password, email) values (%s, %s, %s)',
                (username, password, email)
            )
        except mysql.connector.errors.IntegrityError as e:
            str_error = str(e)
            if 'Duplicate entry' in str_error:
                if 'username' in str_error:
                    raise UsernameAlreadyExists
                elif 'email' in str_error:
                    raise EmailAlreadyExists
            raise e
        except Exception as e:
            raise e
        return self.get_admin(username)

    def create_user(
            self,
            username: str,
            password: str,
            email: str,
            first_name: str,
            last_name: str,
            age: int
    ) -> 'User':
        try:
            self.mysql_connection.execute(
                'Insert into user_table (username, password, email, age, first_name, last_name) values (%s, %s, %s, %s, %s, %s)',
                (username, password, email, age, first_name, last_name)
            )
        except mysql.connector.errors.IntegrityError as e:
            str_error = str(e)
            if 'Duplicate entry' in str_error:
                if 'username' in str_error:
                    raise UsernameAlreadyExists
                elif 'email' in str_error:
                    raise EmailAlreadyExists
            raise e
        except Exception as e:
            raise e
        return self.get_user(username)


class User(CustomSerializable):
    def __init__(
            self,
            user_id: int,
            username: str,
            email: str,
            first_name: Optional[str],
            last_name: Optional[str],
            age: Optional[int],
            is_admin: bool
    ):
        self.user_id: int = user_id
        self.username: str = username
        self.email: str = email
        self.first_name: str = first_name
        self.last_name: str = last_name
        self.age: int = age
        self.is_admin: bool = is_admin

    def generate_session_key(self) -> str:
        from auth.session import Session
        return Session.create_session(user=self)

    def __str__(self):
        if not self.is_admin:
            return f"{self.user_id} {self.username} {self.email}"
        else:
            return f'admin: {self.user_id} {self.username}'

    # def __dict__(self):
    #     return {
    #         'user_id': self.user_id,
    #         'username': self.username,
    #         'email': self.email,
    #         'first_name': self.first_name,
    #         'last_name': self.last_name,
    #         'age': self.age,
    #         'is_admin': self.is_admin
    #     }


if __name__ == '__main__':
    user_manager = UserManager()
    # user = user_manager.create_user(
    #     username='test15342',
    #     password='test',
    #     last_name='test',
    #     first_name='test',
    #     email='sdsz15424',
    # )
    user = user_manager.get_user('test152342')
    print(user)
