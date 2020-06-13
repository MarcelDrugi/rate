from django.test import TestCase, Client
from django.urls import reverse
from rest_framework.test import APITestCase

'''
API views tests
'''


class StockCurrentPriceTest(APITestCase):
    def test_stock_current(self):
        response = self.client.get(
            reverse(
                'rates_server:stock_currency',
                kwargs={'shortcut': 'AAPL'}
            ),
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 6)
        self.assertIsInstance(response.data, dict)
        self.assertIsInstance(response.data['c'], float)


class StockHistoricalPriceTest(APITestCase):
    def test_stock_historical(self):
        response = self.client.get(
            reverse(
                'rates_server:stock_historical',
                kwargs={
                    'shortcut': 'LVUS',
                    'interval': '1',
                    'from': 1572651390,
                    'to': 1572910590
                }
            ),
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 7)
        self.assertIsInstance(response.data, dict)
        self.assertIsInstance(response.data['v'], list)


class TopBarPriceTest(APITestCase):
    def test_top_bar(self):
        response = self.client.get(
            reverse('rates_server:top_bar', kwargs={'shortcut': 'FB'}),
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertIsInstance(response.data, dict)
        self.assertIsInstance(response.data['quote'], dict)


class IndexCurrentTest(APITestCase):
    def test_index_current(self):
        response = self.client.get(
            reverse(
                'rates_server:index_current', kwargs={'shortcut': 'US30'}
            ),
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data[0]), 5)
        self.assertIsInstance(response.data, list)
        self.assertIsInstance(response.data[0], dict)


class IndexHistoricalTest(APITestCase):
    def test_index_historical(self):
        response = self.client.get(
            reverse(
                'rates_server:index_historical',
                kwargs={'shortcut': 'US100', 'interval': '5m', 'limit': '100'}
            ),
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 100)
        self.assertIsInstance(response.data, list)
        self.assertIsInstance(response.data[0], list)


class ETFCurrentTest(APITestCase):
    def test_etf_current(self):
        response = self.client.get(
            reverse(
                'rates_server:etf_current',
                kwargs={'shortcut': 'QQQ'}
            ),
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertIsInstance(response.data, dict)
        self.assertIsInstance(response.data['data'], list)


class ETFHistoricalTest(APITestCase):
    def test_etf_historical(self):
        response = self.client.get(
            reverse(
                'rates_server:etf_historical',
                kwargs={'shortcut': 'RSP', 'interval': '1min', 'limit': '15'}
            ),
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)
        self.assertEqual(len(response.data['values']), 15)
        self.assertIsInstance(response.data, dict)
        self.assertIsInstance(response.data['values'], list)


class CurrencyInfoTest(APITestCase):
    def test_currency_info(self):
        response = self.client.get(
            reverse('rates_server:currency_info'),
            format='json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertIsInstance(response.data, dict)
        self.assertIsInstance(response.data['quote'], dict)


class CurrencyCurrentTest(APITestCase):
    def test_currency_current(self):
        response = self.client.get(
            reverse(
                'rates_server:currency_current',
                kwargs={
                    'shortcut': 'OANDA:EUR_USD',
                    'begin': '1575191390',
                    'end': '1575243390'
                }
            ),
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 7)
        self.assertIsInstance(response.data, dict)
        self.assertIsInstance(response.data['c'], list)


class CurrencyHistoricalTest(APITestCase):
    def test_currency_historical(self):
        response = self.client.get(
            reverse(
                'rates_server:currency_historical',
                kwargs={
                    'shortcut': 'OANDA:USD_PLN',
                    'begin': '1572651390',
                    'end': '1575243390',
                    'interval': '60'
                }
            ),
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 7)
        self.assertIsInstance(response.data, dict)
        self.assertIsInstance(response.data['c'], list)


class CryptoCurrentTest(APITestCase):
    def test_crypto_current(self):
        shortcut = 'bitcoin'
        response = self.client.get(
            reverse(
                'rates_server:crypto_current',
                kwargs={'shortcut': shortcut}
            ),
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 29)
        self.assertEqual(response.data['id'], shortcut)
        self.assertIsInstance(response.data, dict)
        self.assertIsInstance(response.data['description'], dict)


class CryptoHistoricalTest(APITestCase):
    def test_crypto_historical(self):
        shortcut = 'eos'
        response = self.client.get(
            reverse(
                'rates_server:crypto_historical',
                kwargs={
                    'shortcut': shortcut,
                    'begin': '1572651390',
                    'end': '1575243390',
                }
            ),
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)
        self.assertIsInstance(response.data, dict)
        self.assertIsInstance(response.data['prices'], list)


class CompanyInfoTest(APITestCase):
    def test_company_info(self):
        shortcut = 'FB'
        response = self.client.get(
            reverse(
                'rates_server:stock_info',
                kwargs={'shortcut': shortcut}
            ),
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 12)
        self.assertIsInstance(response.data, dict)
        self.assertIsInstance(response.data['exchange'], str)
        self.assertEqual(response.data['ticker'], shortcut)


class NewsTest(APITestCase):
    def test_news(self):
        response = self.client.get(reverse('rates_server:news'), format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)
        self.assertIsInstance(response.data, dict)
        self.assertIsInstance(response.data['totalResults'], int)
        self.assertIsInstance(response.data['articles'], list)


class MainTest(TestCase):
    # SPA view test
    def test_main_view(self):
        response = Client().get(reverse('rates_server:main'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'rates_server/index.html')

