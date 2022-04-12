from typing import List

from database import mysql_connection
from stock.stock import Stock, StockManager


class TransactionDontExist(Exception):
    pass


class Transaction:
    def __init__(
            self,
            transaction_id: int,
            instrumentId: str,
            quantity: int,
            price: float,
            user_id: int,
            purchase_date  # TODO: datetime
    ):
        self.transaction_id = transaction_id
        self.instrumentId = instrumentId
        self.quantity = quantity
        self.price = price
        self.user_id = user_id
        self.purchase_date = purchase_date

    @property
    def user(self):
        from auth import user_manager
        return user_manager.get_user(self.user_id)

    @property
    def stock(self) -> Stock:
        from stock.stock import StockManager
        return StockManager.get_stock_by_id(self.instrumentId)

    def __iter__(self):
        return iter([self.transaction_id, self.stock, self.quantity, self.price, self.user, self.purchase_date])

    def to_dict(self):
        return {
            "transaction_id": self.transaction_id,
            "stock": self.stock,
            "quantity": self.quantity,
            "price": self.price,
            "user": self.user,
            "purchase_date": self.purchase_date
        }


class TransactionManager:
    @staticmethod
    def get_transaction_by_id(transaction_id: int) -> Transaction:
        data = mysql_connection.fetch_all(
            "SELECT * FROM transaction_table WHERE transaction_id = %s",
            (transaction_id,)
        )
        if len(data) == 0:
            raise TransactionDontExist
        return Transaction(*data[0])

    @staticmethod
    def get_transactions_by_instrumentId(instrumentId: str) -> List[Transaction]:
        data = mysql_connection.fetch_all(
            "SELECT * FROM transaction_table WHERE instrumentId = %s",
            (instrumentId,)
        )
        return [Transaction(*row) for row in data]

    @staticmethod
    def get_transactions_by_stock(stock: Stock) -> List[Transaction]:
        return TransactionManager.get_transactions_by_instrumentId(stock.instrumentId)

    @staticmethod
    def get_transactions_by_user_id_and_instrumentId(
            user_id: int,
            instrumentId: str
    ):
        data = mysql_connection.fetch_all(
            "SELECT * FROM transaction_table WHERE user_id = %s AND instrumentId = %s",
            (user_id, instrumentId)
        )
        return [Transaction(*row) for row in data]

    @staticmethod
    def get_transactions_by_user_id(user_id: int) -> List[Transaction]:
        data = mysql_connection.fetch_all(
            "SELECT * FROM transaction_table WHERE user_id = %s",
            (user_id,)
        )
        return [Transaction(*row) for row in data]

    @staticmethod
    def create_transaction(
            instrumentId: str,
            quantity: int,
            price: float,
            user_id: int,
            purchase_date  # TODO: datetime
    ) -> Transaction:
        stock = StockManager.get_stock_by_id(instrumentId)
        mysql_connection.execute(
            "INSERT INTO transaction_table (instrumentId, quantity, price, user_id, purchase_date) "
            "VALUES (%s, %s, %s, %s, %s)",
            (instrumentId, quantity, price, user_id, purchase_date)
        )
        return TransactionManager.get_transaction_by_id(
            mysql_connection.last_insert_id()
        )
