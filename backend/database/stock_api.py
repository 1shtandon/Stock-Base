import json
import os

import requests


if __name__ == '__main__':
    from dotenv import load_dotenv
    load_dotenv('../.env')

    ALPHAVANTAGE_API_KEY = os.environ['ALPHAVANTAGE_API_KEY']

    response = requests.get(
        'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=RELIANCE.BSE&outputsize=full&apikey={}'.format(ALPHAVANTAGE_API_KEY)
    )
    with open('data.json', 'w') as f:
        f.write(json.dumps(response.json()))
    print(response.json())
