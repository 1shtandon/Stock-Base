import json
import random

from stock.stock import StockManager


def import_from_file(filename: str):
    with open(filename, 'r') as file:
        data = json.load(file)

    for key, value in data.items():
        try:
            stand_alone_data = value['stand_alone_data']
            high, low = float(stand_alone_data['high_low'].replace(',', '').split('/')[0]), float(
                stand_alone_data['high_low'].replace(',', '').split('/')[1])
            StockManager.create_stock(
                instrumentId=key,
                stockType="NSE",
                prevClose=stand_alone_data['current_price'] + random.randint(1, 10),
                dayHigh=high,
                dayLow=low,
                high52weeks=stand_alone_data['week_high_52'] if stand_alone_data['week_high_52'] else high,
                low52weeks=stand_alone_data['week_low_52'] if stand_alone_data['week_high_52'] else low,
                dividendYield=stand_alone_data['dividend_yield'],
                faceValue=stand_alone_data['face_value'],
                bookValue=stand_alone_data['book_value'],
                pros='A normal stock',
                cons='A normal stock',
                marketCap=stand_alone_data['market_cap'],
                price=stand_alone_data['current_price'],
                about='A normal stock',
                PERatio=stand_alone_data['stock_p_e'],
                stockName=value['name'],
            )
        except Exception as e:
            print(e)


if __name__ == '__main__':
    import_from_file('data.json')
