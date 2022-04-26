from typing import List

from auth.user import User
from database import mysql_connection
from util import CustomSerializable


class FeedbackDontExist(Exception):
    pass


class Feedback(CustomSerializable):
    def __init__(self, feedback_id, user_id, title, message):
        self.feedback_id = feedback_id
        self.user_id = user_id
        self.title = title
        self.message = message

    @property
    def user(self):
        from auth import user_manager
        return user_manager.get_user(username=self.user_id)


class FeedbackManager:
    @staticmethod
    def get_feedback(feedback_id):
        data = mysql_connection.fetch_all(
            "SELECT * FROM feedback_table WHERE feedback_id = %s", (feedback_id,)
        )
        if len(data) == 0:
            raise FeedbackDontExist
        data, = data
        return Feedback(
            feedback_id=data[0],
            user_id=data[1],
            title=data[2],
            message=data[3]
        )

    @staticmethod
    def create_feedback(user: User, title, message) -> Feedback:
        mysql_connection.execute(
            "INSERT INTO feedback_table (user_id, title, message) VALUES (%s, %s, %s)",
            (user.user_id, title, message)
        )
        return FeedbackManager.get_feedback(mysql_connection.last_insert_id())

    @staticmethod
    def get_feedback_list(user: User = None) -> List[Feedback]:
        if user is None:
            data = mysql_connection.fetch_all(
                "SELECT * FROM feedback_table"
            )
        else:
            data = mysql_connection.fetch_all(
                "SELECT * FROM feedback_table WHERE user_id = %s", (user.user_id,)
            )
        return [Feedback(
            feedback_id=data[0],
            user_id=data[1],
            title=data[2],
            message=data[3]
        ) for data in data]
