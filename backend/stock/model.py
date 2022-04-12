from pydantic import BaseModel


class StockModel(BaseModel):
    instrumentId: str
    stockType: str
    prevClose: float
    dayHigh: float
    dayLow: float
    high52weeks: float
    low52weeks: float
    dividendYield: float
    faceValue: float
    bookValue: float
    pros: str
    cons: str
    marketCap: float
    price: float
    about: str
    PERatio: float
    stockName: str
