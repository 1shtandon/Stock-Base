from typing import List

import mysql.connector

from database import mysql_connection


class StockDontExist(Exception):
    pass


class StockAlreadyExist(Exception):
    pass


class Stock:
    def __init__(
            self,
            instrument_id: str,
            stock_type: str,
            stock_name: str,
            prev_close: float,
            current_prize: float,
            day_high: float,
            day_low: float
    ):
        self.instrument_id = instrument_id
        self.stock_type = stock_type
        self.stock_name = stock_name
        self.prev_close = prev_close
        self.current_prize = current_prize
        self.day_high = day_high
        self.day_low = day_low

    def __str__(self):
        return f"{self.instrument_id}"


class StockManager:

    @staticmethod
    def get_all_stocks() -> List[Stock]:
        data = mysql_connection.fetch_all(
            "SELECT instrument_id, stock_type, stock_name, prev_close, currentPrice, day_high, day_low FROM stock_table"
        )
        return [Stock(
            instrument_id=row[0],
            stock_type=row[1],
            stock_name=row[2],
            prev_close=row[3],
            current_prize=row[4],
            day_high=row[5],
            day_low=row[6]
        ) for row in data]

    @staticmethod
    def get_stock_by_id(instrument_id: str) -> Stock:
        data = mysql_connection.fetch_all(
            "SELECT instrument_id, stock_type, stock_name, prev_close, prev_close, currentPrice, day_high, day_low FROM stock_table WHERE instrument_id = %s",
            (instrument_id,)
        )
        if len(data) == 0:
            raise StockDontExist(f"Stock with id {instrument_id} doesn't exist")
        data, = data
        return Stock(
            instrument_id=data[0],
            stock_type=data[1],
            stock_name=data[2],
            prev_close=data[3],
            current_prize=data[4],
            day_high=data[5],
            day_low=data[6]
        )

    @staticmethod
    def create_stock(
            instrument_id: str,
            stock_type: str,
            stock_name: str,
            prev_close: float,
            current_prize: float,
            day_high: float,
            day_low: float
    ) -> Stock:
        try:
            mysql_connection.execute(
                "INSERT INTO stock_table (instrument_id, stock_type, stock_name, prev_close, currentPrice, day_high, day_low) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (instrument_id, stock_type, stock_name, prev_close, current_prize, day_high, day_low)
            )
        except mysql.connector.errors.IntegrityError as e:
            raise StockAlreadyExist(f"Stock with id {instrument_id} already exist") from e
        return Stock(
            instrument_id=instrument_id,
            stock_type=stock_type,
            stock_name=stock_name,
            prev_close=prev_close,
            current_prize=current_prize,
            day_high=day_high,
            day_low=day_low
        )

    @staticmethod
    def search_stocks_by_name(stock_name: str) -> List[Stock]:
        data = mysql_connection.fetch_all(
            "SELECT instrument_id, stock_type, stock_name, prev_close, currentPrice, day_high, day_low FROM "
            "stock_table WHERE stock_name LIKE CONCAT('%',%s,'%')",
            (stock_name,)
        )
        return [
            Stock(
                instrument_id=row[0],
                stock_type=row[1],
                stock_name=row[2],
                prev_close=row[3],
                current_prize=row[4],
                day_high=row[5],
                day_low=row[6]
            )
            for row in data]
