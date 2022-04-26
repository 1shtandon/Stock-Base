import functools
import random
import string

from auth import user_manager
from auth.user import User
from database import mysql_connection


class InvalidSession(Exception):
    pass


class Session:

    @staticmethod
    def _generate_session_key():
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=20))

    @staticmethod
    def get_session(session_id) -> User:
        data = mysql_connection.fetch_all(
            "SELECT user_id, is_admin FROM sessios_table WHERE session_key = %s",
            (session_id,)
        )
        if len(data) == 0:
            raise InvalidSession
        user_id = data[0][0]
        is_admin = data[0][1]
        if is_admin:
            user = user_manager.get_admin(user_id)
        else:
            user = user_manager.get_user(user_id)
        return user

    @staticmethod
    def create_session(user: User) -> str:
        session_key = Session._generate_session_key()
        mysql_connection.execute(
            "INSERT INTO sessios_table (session_key, user_id, is_admin) VALUES (%s, %s, %s)",
            (session_key, user.user_id, user.is_admin)
        )
        return session_key

    @staticmethod
    def clear_session(session_id: str):
        try:
            mysql_connection.execute(
                "DELETE FROM sessios_table WHERE session_key = %s",
                (session_id,)
            )
        except:
            pass
