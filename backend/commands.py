import argparse
import traceback

commands = [
    'create',
    'superuser',
    'update',
]

parser = argparse.ArgumentParser(description='Commands for the Backend')
parser.add_argument('--command', type=str, help='Command to execute{}'.format('\n\t'.join([c for c in commands])))

args = parser.parse_args()
command = args.command

if command not in commands:
    print('Invalid command')
    print('Valid commands are: \n\t{}'.format('\n\t'.join([c for c in commands])))
    exit(1)

if command == 'create':
    from database import mysql_connection

    mysql_connection.create_tables()
elif command == 'superuser':
    from auth import user_manager

    user_manager.create_admin(
        username=input('Username: '),
        password=input('Password: '),
        email=input('Email: '),
    )
elif command == 'update':
    from stock.stock import StockManager

    stocks = StockManager.get_all_stocks()
    for stock in stocks:
        try:
            StockManager.update_stock(stock.instrumentId)
            print('Updated {}'.format(stock.instrumentId))
        except Exception as e:
            print('Failed to update {}'.format(stock.instrumentId))
            print(e)
