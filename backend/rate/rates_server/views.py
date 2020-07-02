import requests
from rest_framework.response import Response
from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework import status

'''
API keys are intentionally left available to familiarize yourself with all 
the functionality of the application.
'''


class MainView(TemplateView):
    template_name = 'rates_server/index.html'


class StockCurrentPrice(APIView):
    def get_price(self, shortcut):
        API_KEY = 'br3663nrh5rai6tgf4o0'
        params = {
            'symbol': shortcut,
            'token': API_KEY,
        }
        url = 'https://finnhub.io/api/v1/quote'
        return requests.get(url, params=params).json()

    def get(self, request, **kwargs):
        price = self.get_price(kwargs['shortcut'])
        return Response(
            price,
            status=status.HTTP_200_OK
        )


class StockHistoricalPrice(APIView):
    def get_historical_price(self, shortcut, interval, begin, end):
        API_KEY = 'br3663nrh5rai6tgf4o0'
        url = 'https://finnhub.io/api/v1/stock/candle'
        params = {
            'symbol': shortcut,
            'resolution': interval,
            'from': begin,
            'to': end,
            'token': API_KEY
        }
        return requests.get(url, params=params).json()

    def get(self, request, **kwargs):
        prices = self.get_historical_price(
            kwargs['shortcut'],
            kwargs['interval'],
            kwargs['from'],
            kwargs['to'],
        )
        return Response(
            prices,
            status=status.HTTP_200_OK
        )


class TopBarPrice(APIView):
    def get_historical_price(self, shortcut):
        API_KEY = 'sk_98fff762c124426980df193eaf7ad3c6'
        url = 'https://cloud.iexapis.com/stable/stock/' + shortcut + '/batch'
        params = {
            'types': 'quote',
            'token': API_KEY,
        }
        return requests.get(url, params=params).json()

    def get(self, request, **kwargs):
        prices = self.get_historical_price(
            kwargs['shortcut'],
        )
        return Response(
            prices,
            status=status.HTTP_200_OK
        )


class IndexCurrentPrice(APIView):
    def get_current_price(self, shortcut):
        url = 'https://api-adapter.backend.currency.com/api/v1/aggTrades'
        params = {
            'symbol': shortcut,
            'limits': 1,
        }
        return requests.get(url, params=params).json()

    def get(self, request, **kwargs):
        prices = self.get_current_price(
            kwargs['shortcut'],
        )
        return Response(
            prices,
            status=status.HTTP_200_OK
        )


class IndexHistoricalPrice(APIView):
    def get_historical_price(self, shortcut, interval, limit):
        url = 'https://api-adapter.backend.currency.com/api/v1/klines'
        params = {
            'symbol': shortcut,
            'interval': interval,
            'limit': limit
        }
        return requests.get(url, params=params).json()

    def get(self, request, **kwargs):
        prices = self.get_historical_price(
            kwargs['shortcut'],
            kwargs['interval'],
            kwargs['limit'],
        )
        return Response(
            prices,
            status=status.HTTP_200_OK
        )


class ETFCurrentPrice(APIView):
    def get_current_price(self, shortcut):
        API_KEY = '860f0458847140dcb932bee40f61aa6b'
        url = 'https://api.twelvedata.com/etf'
        params = {
            'symbol': shortcut,
            'apikey': API_KEY,
        }
        return requests.get(url, params=params).json()

    def get(self, request, **kwargs):
        prices = self.get_current_price(
            kwargs['shortcut'],
        )
        return Response(
            prices,
            status=status.HTTP_200_OK
        )


class ETFHistoricalPrice(APIView):
    def get_historical_price(self, shortcut, interval, limit):
        API_KEY = '860f0458847140dcb932bee40f61aa6b'
        url = 'https://api.twelvedata.com/time_series'
        params = {
            'symbol': shortcut,
            'interval': interval,
            'outputsize': limit,
            'apikey': API_KEY,
        }
        return requests.get(url, params=params).json()

    def get(self, request, **kwargs):
        prices = self.get_historical_price(
            kwargs['shortcut'],
            kwargs['interval'],
            kwargs['limit'],
        )
        return Response(
            prices,
            status=status.HTTP_200_OK
        )


class CurrencyInfo(APIView):
    def get_info(self):
        API_KEY = 'br3663nrh5rai6tgf4o0'
        url = 'https://finnhub.io/api/v1/forex/rates'
        params = {
            'token': API_KEY,
        }
        return requests.get(url, params=params).json()

    def get(self, request, **kwargs):
        info = self.get_info()
        return Response(
            info,
            status=status.HTTP_200_OK
        )


class CurrencyCurrentPrice(APIView):
    def get_current_price(self, shortcut, begin, end):
        API_KEY = 'br3663nrh5rai6tgf4o0'
        url = 'https://finnhub.io/api/v1/forex/candle'
        params = {
            'symbol': shortcut,
            'resolution': '1',
            'from': begin,
            'to': end,
            'token': API_KEY,
        }
        return requests.get(url, params=params).json()

    def get(self, request, **kwargs):
        prices = self.get_current_price(
            kwargs['shortcut'],
            kwargs['begin'],
            kwargs['end'],
        )
        return Response(
            prices,
            status=status.HTTP_200_OK
        )


class CurrencyHistoricalPrice(APIView):
    def get_historical_price(self, shortcut, interval, begin, end):
        API_KEY = 'br3663nrh5rai6tgf4o0'
        url = 'https://finnhub.io/api/v1/forex/candle'

        params = {
            'symbol': shortcut,
            'resolution': interval,
            'from': begin,
            'to': end,
            'token': API_KEY,
        }
        return requests.get(url, params=params).json()

    def get(self, request, **kwargs):
        prices = self.get_historical_price(
            kwargs['shortcut'],
            kwargs['interval'],
            kwargs['begin'],
            kwargs['end'],
        )
        return Response(
            prices,
            status=status.HTTP_200_OK
        )


class CryptoCurrentPrice(APIView):
    def get_current_price(self, shortcut):
        url = 'https://api.coingecko.com/api/v3/coins/' + shortcut
        return requests.get(url).json()

    def get(self, request, **kwargs):
        prices = self.get_current_price(
            kwargs['shortcut'],
        )
        return Response(
            prices,
            status=status.HTTP_200_OK
        )


class CryptoHistoricalPrice(APIView):
    def get_historical_price(self, shortcut, begin, end):
        url = 'https://api.coingecko.com/api/v3/coins/' + \
              shortcut + '/market_chart/range'

        params = {
            'vs_currency': 'usd',
            'from': begin,
            'to': end,
        }
        return requests.get(url, params=params).json()

    def get(self, request, **kwargs):
        prices = self.get_historical_price(
            kwargs['shortcut'],
            kwargs['begin'],
            kwargs['end'],
        )
        return Response(
            prices,
            status=status.HTTP_200_OK
        )


class CompanyInfo(APIView):
    def get_company_info(self, shortcut):
        API_KEY = 'br3663nrh5rai6tgf4o0'
        url = 'https://finnhub.io/api/v1/stock/profile2'
        params = {
            'symbol': shortcut,
            'token': API_KEY,
        }
        return requests.get(url, params=params).json()

    def get(self, request, **kwargs):
        info = self.get_company_info(
            kwargs['shortcut'],
        )
        return Response(
            info,
            status=status.HTTP_200_OK
        )


class News(APIView):
    def get_news(self):
        API_KEY = '7f4214ba280d4d619c7269356587d89e'
        url = 'https://newsapi.org/v2/top-headlines'
        params = {
            'country': 'us',
            'category': 'business',
            'apiKey': API_KEY,
        }
        return requests.get(url, params=params).json()

    def get(self, request, **kwargs):
        news = self.get_news()
        return Response(
            news,
            status=status.HTTP_200_OK
        )

