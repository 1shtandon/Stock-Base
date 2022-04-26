from typing import List

import mysql.connector

from database import mysql_connection
from database.stockApi import StockApi
from util import CustomSerializable


class StockDontExist(Exception):
    pass


class StockAlreadyExist(Exception):
    pass


class Stock(CustomSerializable):
    def __init__(
            self,
            instrumentId: str,
            prevClose: float,
            dayHigh: float,
            dayLow: float,
            high52weeks: float,
            low52weeks: float,
            dividendYield: float,
            faceValue: float,
            bookValue: float,
            pros: str,
            cons: str,
            marketCap: float,
            price: float,
            PERatio: float,
            about: str,
            stockType: str,
            stockName: str,
    ):
        self.instrumentId = instrumentId
        self.stockType = stockType
        self.prevClose = prevClose
        self.dayHigh = dayHigh
        self.dayLow = dayLow
        self.high52weeks = high52weeks
        self.low52weeks = low52weeks
        self.dividendYield = dividendYield
        self.faceValue = faceValue
        self.bookValue = bookValue
        self.pros = pros
        self.cons = cons
        self.marketCap = marketCap
        self.price = price
        self.about = about
        self.stockName = stockName
        self.PERatio = PERatio

    @staticmethod
    def create(data) -> 'Stock':
        return Stock(
            instrumentId=data[0],
            stockType=data[1],
            prevClose=data[2],
            dayHigh=data[3],
            dayLow=data[4],
            high52weeks=data[5],
            low52weeks=data[6],
            dividendYield=data[7],
            faceValue=data[8],
            bookValue=data[9],
            pros=data[10],
            cons=data[11],
            marketCap=data[12],
            price=data[13],
            about=data[14],
            stockName=data[15],
            PERatio=data[16],
        )

    def __str__(self):
        return f"{self.instrumentId}"


class StockManager:

    @staticmethod
    def get_all_stocks() -> List[Stock]:
        data = mysql_connection.fetch_all(
            "SELECT instrumentId, stockType, prevClose, dayHigh, dayLow, high52weeks, low52weeks, dividendYield, faceValue, bookValue, pros, cons, marketCap, price, about, stockName, PERatio FROM stock_table"
        )
        return [Stock.create(row) for row in data]

    @staticmethod
    def get_stock_by_id(instrumentId: str) -> Stock:
        data = mysql_connection.fetch_all(
            "SELECT instrumentId, stockType, prevClose, dayHigh, dayLow, high52weeks, low52weeks, dividendYield, faceValue, bookValue, pros, cons, marketCap, price, about, stockName, PERatio FROM stock_table WHERE instrumentId = %s",
            (instrumentId,)
        )
        if len(data) == 0:
            raise StockDontExist(f"Stock with id {instrumentId} doesn't exist")
        data, = data
        return Stock.create(data)

    @staticmethod
    def create_stock(
            instrumentId: str,
            stockType: str,
            prevClose: float,
            dayHigh: float,
            dayLow: float,
            high52weeks: float,
            low52weeks: float,
            dividendYield: float,
            faceValue: float,
            bookValue: float,
            pros: str,
            cons: str,
            marketCap: float,
            price: float,
            about: str,
            PERatio: float,
            stockName: str
    ) -> Stock:
        try:
            mysql_connection.execute(
                "INSERT INTO stock_table (instrumentId, prevClose, dayHigh, dayLow, high52weeks, low52weeks, "
                "dividendYield, faceValue, bookValue, pros, cons, marketCap, price, about, stockType, PERatio, stockName) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (instrumentId, prevClose, dayHigh, dayLow, high52weeks, low52weeks, dividendYield, faceValue,
                 bookValue, pros, cons, marketCap, price, about, stockType, PERatio, stockName)
            )
        except mysql.connector.errors.IntegrityError as e:
            raise StockAlreadyExist(f"Stock with id {instrumentId} already exist") from e
        return StockManager.get_stock_by_id(instrumentId=instrumentId)

    @staticmethod
    def search_stocks_by_name(stock_name: str) -> List[Stock]:
        data = mysql_connection.fetch_all(
            "SELECT instrumentId, stockType, prevClose, dayHigh, dayLow, high52weeks, low52weeks, dividendYield, faceValue, bookValue, pros, cons, marketCap, price, about, stockName, PERatio FROM "
            "stock_table WHERE stock_table.stockName LIKE CONCAT('%',%s,'%')",
            (stock_name,)
        )
        return [Stock.create(row) for row in data]

    @staticmethod
    def update_stock(
            stock_id: str,
    ):
        StockManager.get_stock_by_id(instrumentId=stock_id)
        data = StockApi.get_stock(stock_id)
        mysql_connection.execute(
            "UPDATE stock_table SET dayHigh = %s, dayLow = %s, dividendYield = %s, faceValue = %s, bookValue = %s, marketCap = %s, price = %s WHERE instrumentId = %s",
            (data['dayHigh'], data['dayLow'], data['dividendYield'], data['faceValue'], data['bookValue'],
             data['marketCap'], data['price'], stock_id)
        )
        return StockManager.get_stock_by_id(instrumentId=stock_id)
