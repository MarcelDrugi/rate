import { HistoricalPrice } from './../models/historical-price.model';
import { ETFInfoPrice } from './../models/etf-info-price.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CurrentPrice } from '../models/current-price.model';
import { CurrentIndexPrice } from '../models/current-index-price.model';
import { CurrencyInfoPrice } from '../models/currency-info-price.model';
import { CryptoInfoPrice } from '../models/crypto-info-price.model';
import { TopBarPrice } from '../models/top-bar-price.model';
import { retry } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class PriceApiService {

  constructor(private http: HttpClient) { }

  getTopBarPrice(shortcut: string): Observable<any> {
    const url = './top_bar/' + shortcut;

    return this.http.get<TopBarPrice>(url).pipe(retry(2));
  }

  getCurrentStockPrice(shortcut: string): Observable<CurrentPrice> {
    return this.http.get<CurrentPrice>('./stocks/current/' + shortcut).pipe(retry(2));
  }

  getHistoricalStockPrice(shortcut: string, interval: string): Observable<Array<any>> {
    let url: string;
    let now: Date;
    let last: Date;

    if (interval === 'full') {
      interval = 'D';
      now = new Date();
      last = new Date(new Date().setDate(new Date().getDate() - 1500));
    }
    else if (interval === '1hour'){
      interval = '60';
      now = new Date();
      last = new Date(new Date().setDate(new Date().getDate() - 30));
    }
    else if (interval === '15min'){
      interval = '60';
      now = new Date();
      last = new Date(new Date().setDate(new Date().getDate() - 9));
    }
    else if (interval === '1min'){
      interval = '1';
      now = new Date();
      last = new Date(new Date().setDate(new Date().getDate() - 4));
    }

    const from = Math.floor(last.getTime() / 1000);
    const to = Math.floor(now.getTime() / 1000);
    url = './stocks/historical/'
      + shortcut
      + '/' + interval
      + '/' + from
      + '/' + to;

    return this.http.get<Array<any>>(url).pipe(retry(2));
  }

  getCurrentIndexPrice(shortcut: string): Observable<CurrentIndexPrice> {
    return this.http.get<CurrentIndexPrice>('./indexes/current/' + shortcut).pipe(retry(2));
  }

  getHistoricalIndexPrice(shortcut: string, interval: string): Observable<any> {
    let url: string;
    let set: number;
    if (interval === 'full') {
      interval = '1w';
      set = 250;
    }
    else if (interval === '1hour') {
      interval = '1h';
      set = 450;
    }
    else if (interval === '15min') {
      interval = '1h';
      set = 115;
    }
    else {
      interval = '5m';
      set = 100;
    }

    url = 'indexes/historical/'
      + shortcut
      + '/' + interval
      + '/' + set;

    return this.http.get<Array<HistoricalPrice>>(url).pipe(retry(2));
  }

  getETFInfo(shortcut: string): Observable<Array<ETFInfoPrice>> {
    return this.http.get<Array<ETFInfoPrice>>('./etfs/current/' + shortcut).pipe(retry(2));
  }

  getHistoricalETFPrice(shortcut: string, interval: string): Observable<any> {
    let set: number;
    if (interval === 'full') {
      set = 90;
      interval = '1month';
    }
    else if (interval === 'now') {
      interval = '1min';
      set = 1;
    }
    else {
      set = 650;
      interval = '15min';
    }
    const url = 'etfs/historical/'
      + shortcut
      + '/' + interval
      + '/' + set;

    return this.http.get<any>(url).pipe(retry(2));
  }

  getCurrencyInfo(): Observable<CurrencyInfoPrice> {
    const url = './currencies/info/';
    return this.http.get<CurrencyInfoPrice>(url).pipe(retry(2));
  }

  getCurrentCurrencyPrice(shortcut: string): Observable<CurrentPrice> {
    let url: string;
    let now: Date;
    let last: Date;

    now = new Date();
    last = new Date(new Date().setDate(new Date().getDate() - 2));

    const to = Math.floor(now.getTime() / 1000);
    const from = to - 225000;
    url = './currencies/current/'
      + shortcut
      + '/' + from
      + '/'
      + to;

    return this.http.get<CurrentPrice>(url).pipe(retry(2));
  }

  getHistoricalCurrencyPrice(shortcut: string, interval: string): Observable<Array<any>> {
    let url: string;
    let now: Date;
    let last: Date;
    const apiKey = 'br3663nrh5rai6tgf4o0';

    if (interval === 'full') {
      interval = 'D';
      now = new Date();
      last = new Date(new Date().setDate(new Date().getDate() - 1500));
    }
    else if (interval === '1hour'){
      interval = '60';
      now = new Date();
      last = new Date(new Date().setDate(new Date().getDate() - 30));
    }
    else if (interval === '15min'){
      interval = '60';
      now = new Date();
      last = new Date(new Date().setDate(new Date().getDate() - 7));
    }
    else if (interval === '1min'){
      interval = '5';
      now = new Date();
      last = new Date(new Date().setDate(new Date().getDate() - 2));
    }

    const from = Math.floor(last.getTime() / 1000);
    const to = Math.floor(now.getTime() / 1000);
    url = './currencies/historical/'
      + shortcut
      + '/' + interval
      + '/' + from
      + '/' + to;

    return this.http.get<Array<any>>(url).pipe(retry(2));
  }

  getCryptoInfo(shortcut: string): Observable<any> {
    return this.http.get<any>(
      './cryptos/current/' + shortcut
      ).pipe(retry(2));
  }

  getHistoricalCryptoPrice(shortcut: string, interval: string): Observable<any> {
    let url: string;
    let now: Date;
    let last: Date;

    if (interval === 'full') {
      now = new Date();
      last = new Date(new Date().setDate(new Date().getDate() - 1500));
    }
    else if (interval === '1hour'){
      now = new Date();
      last = new Date(new Date().setDate(new Date().getDate() - 30));
    }
    else if (interval === '15min'){
      now = new Date();
      last = new Date(new Date().setDate(new Date().getDate() - 7));
    }
    else if (interval === '1min'){
      now = new Date();
      last = new Date(new Date().setDate(new Date().getDate() - 2));
    }

    const from = Math.floor(last.getTime() / 1000);
    const to = Math.floor(now.getTime() / 1000);

    url = './cryptos/historical/'
    + shortcut
    + '/' + from
    + '/' + to;
    return this.http.get<any>(url).pipe(retry(2));
  }
}
