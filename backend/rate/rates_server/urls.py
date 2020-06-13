from django.urls import path
from . import views

app_name = 'rates_server'

urlpatterns = [
    path('', views.MainView.as_view(), name='main'),
    path(
        'stocks/current/<str:shortcut>',
        views.StockCurrentPrice.as_view(),
        name='stock_currency'
    ),
    path(
        'stocks/historical/<str:shortcut>/<str:interval>/<int:from>/<int:to>',
        views.StockHistoricalPrice.as_view(),
        name='stock_historical'
    ),
    path(
        'top_bar/<str:shortcut>',
        views.TopBarPrice.as_view(),
        name='top_bar'
    ),
    path(
        'indexes/current/<str:shortcut>',
        views.IndexCurrentPrice.as_view(),
        name='index_current'
    ),
    path(
        'indexes/historical/<str:shortcut>/<str:interval>/<str:limit>',
        views.IndexHistoricalPrice.as_view(),
        name='index_historical'
    ),
    path(
        'etfs/current/<str:shortcut>',
        views.ETFCurrentPrice.as_view(),
        name='etf_current'
    ),
    path(
        'etfs/historical/<str:shortcut>/<str:interval>/<str:limit>',
        views.ETFHistoricalPrice.as_view(),
        name='etf_historical'
    ),
    path(
        'currencies/info/',
        views.CurrencyInfo.as_view(),
        name='currency_info'
    ),
    path(
        'currencies/current/<str:shortcut>/<str:begin>/<str:end>',
        views.CurrencyCurrentPrice.as_view(),
        name='currency_current'
    ),
    path(
        'currencies/historical/<str:shortcut>/<str:interval>/<str:begin>/'
        '<str:end>',
        views.CurrencyHistoricalPrice.as_view(),
        name='currency_historical'
    ),
    path(
        'cryptos/current/<str:shortcut>/',
        views.CryptoCurrentPrice.as_view(),
        name='crypto_current'
    ),
    path(
        'cryptos/historical/<str:shortcut>/<str:begin>/<str:end>',
        views.CryptoHistoricalPrice.as_view(),
        name='crypto_historical'
    ),
    path(
        'stocks/info/<str:shortcut>',
        views.CompanyInfo.as_view(),
        name='stock_info'
    ),
    path('news/current/', views.News.as_view(), name='news'),
]

