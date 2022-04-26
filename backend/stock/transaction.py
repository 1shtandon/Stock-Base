from typing import List, Tuple

from auth.user import User
from database import mysql_connection
from stock.model import StockValueInfo
from stock.stock import Stock, StockManager
from util import CustomSerializable


class TransactionDontExist(Exception):
    pass


class Transaction(CustomSerializable):
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
    def get_transactions_of_stock(stock: Stock) -> List[Transaction]:
        data = mysql_connection.fetch_all(
            "SELECT * FROM transaction_table WHERE instrumentId = %s",
            (stock.instrumentId,)
        )
        return [Transaction(*row) for row in data]

    @staticmethod
    def get_transactions_of_stock_by_user(
            user: User,
            stock: Stock
    ):
        data = mysql_connection.fetch_all(
            "SELECT * FROM transaction_table WHERE user_id = %s AND instrumentId = %s",
            (user.user_id, stock.instrumentId)
        )
        return [Transaction(*row) for row in data]

    @staticmethod
    def get_transactions_by_user(user: User) -> List[Transaction]:
        data = mysql_connection.fetch_all(
            "SELECT * FROM transaction_table WHERE user_id = %s",
            (user.user_id,)
        )
        return [Transaction(*row) for row in data]

    @staticmethod
    def create_transaction(
            stock: Stock,
            quantity: int,
            price: float,
            user: User,
            purchase_date  # TODO: datetime
    ) -> Transaction:
        mysql_connection.execute(
            "INSERT INTO transaction_table (instrumentId, quantity, price, user_id, purchase_date) "
            "VALUES (%s, %s, %s, %s, %s)",
            (stock.instrumentId, quantity, price, user.user_id, purchase_date)
        )
        return TransactionManager.get_transaction_by_id(
            mysql_connection.last_insert_id()
        )

    @staticmethod
    def delete_transaction(transaction: Transaction, user: User):
        c = mysql_connection.execute(
            "DELETE FROM transaction_table WHERE transaction_id = %s and user_id = %s",
            (transaction.transaction_id, user.user_id,)
        )
        if c.rowcount == 0:
            raise TransactionDontExist
        return c.rowcount

    @staticmethod
    def update_transaction(transaction: Transaction, user_id: int, quantity: int, price_at: float, purchase_date: str):
        c = mysql_connection.execute(
            "UPDATE transaction_table SET quantity = %s, price = %s, purchase_date = %s WHERE transaction_id = %s and user_id = %s",
            (quantity, price_at, purchase_date, transaction.transaction_id, user_id,)
        )
        if c.rowcount == 0:
            raise TransactionDontExist
        return c.rowcount

    @staticmethod
    def get_market_value_and_spend_value_of_stocks_of_user(user: User) -> List[StockValueInfo]:
        data = mysql_connection.fetch_all(
            "SELECT SUM(quantity * st.price) as market_value, SUM(quantity * tt.price) as buyed_value, SUM(quantity), "
            " st.instrumentId, st.stockName, st.stockType, st.price, st.prevClose"
            " FROM transaction_table tt JOIN stock_table st on tt.instrumentId = st.instrumentId where user_id = %s GROUP BY st.instrumentId",
            (user.user_id,)
        )
        return [StockValueInfo(
            market_value=row[0],
            buyed_value=row[1],
            quantity=row[2],
            instrument_id=row[3],
            stock_name=row[4],
            stockType=row[5],
            price=row[6],
            day_gain=round((row[6] - row[7]) / row[7] * 100, 2)
        ) for row in data if row[0]]

    @staticmethod
    def get_market_value_and_buyed_value_of_stocks_of_user_by_stock(user: User, stock: Stock) -> StockValueInfo:
        data = mysql_connection.fetch_one(
            "SELECT SUM(quantity * st.price) as market_value, SUM(quantity * tt.price) as buyed_value, SUM(quantity), st.price, st.prevClose FROM transaction_table tt JOIN stock_table st on tt.instrumentId = st.instrumentId where user_id = %s and tt.instrumentId = %s GROUP BY st.instrumentId",
            (user.user_id, stock.instrumentId,)
        )
        if len(data) == 0:
            raise TransactionDontExist

        return StockValueInfo(
            market_value=data[0],
            buyed_value=data[1],
            quantity=data[2],
            instrument_id=stock.instrumentId,
            stock_name=stock.stockName,
            stockType=stock.stockType,
            price=stock.price,
            day_gain=round((data[3] - data[4]) / data[4] * 100, 2)
        )
