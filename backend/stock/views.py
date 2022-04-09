from typing import Optional

from fastapi import Request, Response, FastAPI

from decorators import admin_required, normal_user_required, login_required
from feedback.models import TransactionModel
from stock.model import StockModel
from stock.stock import StockManager, StockDontExist, StockAlreadyExist
from stock.transaction import TransactionManager


def initialize_views(app: FastAPI) -> None:
    app.post("/stock")(create_stock)
    app.get("/stock/search")(search_stocks)
    app.get("/stock")(get_stock)
    app.get("/stock/all")(get_all_stocks)
    app.post("/transaction")(create_transaction)
    app.get('/transaction')(get_transaction)


@normal_user_required
def get_transaction(request: Request, response: Response, stock_id: Optional[str] = None):
    if stock_id:
        transactions = TransactionManager.get_transactions_by_user_id_and_instrument_id(
            instrument_id=stock_id,
            user_id=request.user.user_id,
        )
    else:
        transactions = TransactionManager.get_transactions_by_user_id(
            user_id=request.user.id
        )
    return transactions


@normal_user_required
def create_transaction(transaction_model: TransactionModel, request: Request, response: Response):
    try:
        transaction = TransactionManager.create_transaction(
            instrument_id=transaction_model.instrument_id,
            quantity=transaction_model.quantity,
            price=transaction_model.price,
            purchase_date=transaction_model.purchase_date,
            user_id=request.user.user_id,
        )
        return transaction
    except StockDontExist:
        return {"message": "Stock doesn't exist"}


@admin_required
def create_stock(request: Request, response: Response, stock_model: StockModel):
    try:
        stock = StockManager.create_stock(
            instrument_id=stock_model.instrument_id,
            stock_name=stock_model.stock_name,
            stock_type=stock_model.stock_type,
            prev_close=stock_model.prev_close,
            day_low=stock_model.day_low,
            day_high=stock_model.day_high,
            current_prize=stock_model.current_prize,
        )
        return stock
    except StockAlreadyExist:
        return {"message": "Stock already exist"}
    except StockDontExist:
        return {"message": "Stock doesn't exist"}


@admin_required
def get_all_stocks(request: Request, response: Response):
    stocks = StockManager.get_all_stocks()
    return stocks


@login_required
def get_stock(request: Request, response: Response, stock_id: str):
    try:
        stock = StockManager.get_stock_by_id(stock_id)
        return stock
    except StockDontExist:
        return {"message": "Stock doesn't exist"}


@login_required
def search_stocks(request: Request, response: Response, stock_name: str):
    stocks = StockManager.search_stocks_by_name(stock_name)
    return stocks
