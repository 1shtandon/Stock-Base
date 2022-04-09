from pydantic import BaseModel


class StockModel(BaseModel):
    instrument_id: str
    stock_type: str
    stock_name: str
    prev_close: float
    current_prize: float
    day_high: float
    day_low: float
