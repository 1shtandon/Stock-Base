from typing import Optional

from fastapi import Request, Response, FastAPI

from decorators import admin_required, normal_user_required, login_required
from feedback.models import TransactionModel
from stock.model import StockModel
from stock.stock import StockManager, StockDontExist, StockAlreadyExist
from stock.transaction import TransactionManager


def initialize_views(app: FastAPI) -> None:
    app.post("/stock/")(create_stock)
    app.get("/stock/search/")(search_stocks)
    app.get("/stock/")(get_stock)
    app.get("/stock/all/")(get_all_stocks)
    app.post("/transaction/")(create_transaction)
    app.get('/transaction/')(get_transaction)
    app.get('/value/')(get_stocks_value)
    app.get('/value/{instrumentId}')(get_stocks_value_of_stock)


@normal_user_required
def get_transaction(request: Request, response: Response, stock_id: Optional[str] = None):
    if stock_id:
        transactions = TransactionManager.get_transactions_of_stock_by_user(
            stock=StockManager.get_stock_by_id(stock_id),
            user=request.user,
        )
    else:
        transactions = TransactionManager.get_transactions_by_user(
            user=request.user
        )
    return transactions


@normal_user_required
def create_transaction(transaction_model: TransactionModel, request: Request, response: Response):
    try:
        transaction = TransactionManager.create_transaction(
            quantity=transaction_model.quantity,
            price=transaction_model.price,
            purchase_date=transaction_model.purchase_date,
            user=request.user,
            stock=StockManager.get_stock_by_id(transaction_model.instrumentId)
        )
        return transaction
    except StockDontExist:
        return {"message": "Stock doesn't exist"}


@admin_required
def create_stock(request: Request, response: Response, stock_model: StockModel):
    try:
        stock = StockManager.create_stock(
            instrumentId=stock_model.instrumentId,
            stockType=stock_model.stockType,
            marketCap=stock_model.marketCap,
            prevClose=stock_model.prevClose,
            dayLow=stock_model.dayLow,
            dayHigh=stock_model.dayHigh,
            bookValue=stock_model.bookValue,
            faceValue=stock_model.faceValue,
            low52weeks=stock_model.low52weeks,
            dividendYield=stock_model.dividendYield,
            high52weeks=stock_model.high52weeks,
            about=stock_model.about,
            price=stock_model.price,
            cons=stock_model.cons,
            pros=stock_model.pros,
            stockName=stock_model.stockName,
            PERatio=stock_model.PERatio,
        )
        return stock
    except StockAlreadyExist:
        response.status_code = 400
        return {"message": "Stock already exist"}


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


@normal_user_required
def get_stocks_value_of_stock(request: Request, response: Response, instrumentId: str):
    data = TransactionManager.get_market_value_and_buyed_value_of_stocks_of_user_by_stock(
        request.user,
        StockManager.get_stock_by_id(instrumentId)
    )
    return data


@normal_user_required
def get_stocks_value(request: Request, response: Response):
    data = TransactionManager.get_market_value_and_spend_value_of_stocks_of_user(request.user)
    return data
