# Rate
##### A web application that allows you to view current and historical stock exchange rates.

 **Live:**  [http://rate.pythonanywhere.com/](http://rate.pythonanywhere.com/)
<br><br>
# <span style="color:red"> Running the application </span>
#### To start the app, follow the steps below.
###### 1. Clone repo:
    git clone https://github.com/MarcelDrugi/rate
###### 2. Go to backend app directory:
    cd rate/backend/rate
###### 3. Create virtual environment:
    virtualenv venv 
###### 4. Activate venv:
    source venv/bin/activate
###### 5. Install requirements:
    pip3 install -r  requirements.txt
###### 6a. Create  <span style="color:black">.env</span> file in <span style="color:black">/rate/backend/rate/rate</span> (the directory that contains <span style="color:black">settings.py</span> file).<br>
###### 6b. To the <span style="color:black">.env</span> file enter some secret key. <br> The file should looks like:
    SECRET_KEY=your_secret_key
###### 7. Go to the project main directory(<span style="color:black">/rate/backend/rate</span>) and run server:
    python3 manage.py runserver


##### The app should be launched at:

    http://127.0.0.1:8000/


## 
# <span style="color:green"> Modify the application </span>

###### 1. Follow steps 1-6b from the <span style="color:red"><i>Running the application</i></span> paragraph.
###### 2. Go to frontend project main directory (<span style="color:black">/rate/frontend/rate</span>) and install dependencies:
    npm install
##### Now the project is ready for modification. Work with the project should look like this:
###### 1. Make changes in the Angular project if you need it. 
###### 2. Build the Angular project and transfer dist directory to Django as a static files:
    ng build --output-path ../../backend/rate/rates_server/static/scripts/ --resources-output-path ../../static
###### 3. Make changes in thr Django project if you need it.
###### 4. Run Django server:
    python3 manage.py runserver
###### 5. See the modifications at: 
    http://127.0.0.1:8000/

##
# Application information
### Frontend

The following technologies were used to create the app:

- **Angular 9** - framework będący podstawą całego projektu,
- **D3Js** in version **4.0** - used to visualize historical data and used to build part of the animation on the website,
- **Bulma & Bulma-Extensions & LESS** used to create styles.



### Backend

The site has a simple backend created using Python frameworks: **Django** and **Django REST Framework**. 
<br>
Backend created to securely store API keys and avoid CORS restrictions.


### The app uses the following public APIs:


- [IEX Cloud API](https://iexcloud.io/docs/api/)
- [Finnhub Stock API](https://finnhub.io/)
- [CURRENCY API](https://currency.com/api)
- [TwelveData](https://twelvedata.com/docs)
- [CoinGecko](https://www.coingecko.com/en/api)
- [NewsAPI](https://newsapi.org/)


