from pydantic import BaseModel, Field


class FeedbackModel(BaseModel):
    title: str
    message: str


class TransactionModel(BaseModel):
    instrumentId: str
    quantity: int
    price: float
    purchase_date: str = Field(..., regex="^\d{4}-\d{2}-\d{2}$")
