from typing import TypedDict

import requests


class StockApiData(TypedDict):
    dayHigh: float
    dayLow: float
    dividendYield: float
    faceValue: float
    bookValue: float
    marketCap: float
    price: float


class StockApi:
    base_url = 'http://127.0.0.1:8001/'

    @staticmethod
    def get_stock(symbol: str) -> StockApiData:
        url = StockApi.base_url + 'stock/' + symbol
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
