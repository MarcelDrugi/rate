Rate
=============
A web application that allows you to view current and historical stock exchange rates.

| **live:**  http://rate.pythonanywhere.com/


Frontend
**********************
The following technologies were used to create the app:

- **Angular 9** - framework będący podstawą całego projektu,
- **D3Js** in version **4.0** - used to visualize historical data and used to build part of the animation on the website,
- **Bulma & Bulma-Extensions & LESS** used to create styles,


Backend
**********************
The site has a simple backend created using Python frameworks: **Django** and **Django REST Framework**. 
| Backend created to securely store API keys and avoid CORS restrictions.

Django 3.0 and Angular 9 integration 
~~~~~~~~~~~~~~~~~~
The way the frontend written in Angular is joined to the Django server may not be obvious. Making changes requires building an application in Angular and transferring static files to the Django project directories

| Work in development mode should look like this:
| 


1) Make changes to the Django project if you need
2) Make changes to the Angular project if you need
3) Build Angular project and transfer dist directory to Django as a static files:

*ng build --output-path ../../backend/rate/rates_server/static/scripts/  --resources-output-path ../../static*

4) Run Django localhost

| Communication with the backend takes place as with the API, but we provide local paths.
| requirements.txt file for Django is in the *backend* directory. 


The app uses the following public APIs:
**********************

- `IEX Cloud API <https://iexcloud.io/docs/api/>`_
- `Finnhub Stock API <https://finnhub.io/>`_
- `CURRENCY API <https://currency.com/api>`_
- `TwelveData <https://twelvedata.com/docs>`_
- `CoinGecko <https://www.coingecko.com/en/api>`_
- `NewsAPI <https://newsapi.org/>`_



