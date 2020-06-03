import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StockInfo } from './../models/stock-info.model';
import { News } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class InfoApiService {

  constructor(private http: HttpClient) { }

  getCompanyInfo(shortcut: string): Observable<StockInfo> {
    return this.http.get<StockInfo>('stocks/info/' + shortcut);
  }

  getNews(): Observable<any> {
    const url = 'news/current/';
    return this.http.get<any>(url);
  }
}
