import { IndexComponent } from './base/index/index.component';
import { EtfComponent } from './base/etf/etf.component';
import { CurrencyComponent } from './base/currency/currency.component';
import { CryptoComponent } from './base/crypto/crypto.component';
import { NewsComponent } from './base/news/news.component';
import { StockComponent } from './base/stock/stock.component';
import { AboutComponent } from './base/about/about.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './base/homepage/homepage.component';


const routes: Routes = [
  { path: '', component: HomepageComponent},
  { path: 'about', component: AboutComponent },
  { path: 'stock', component: StockComponent },
  { path: 'news', component: NewsComponent },
  { path: 'crypto', component: CryptoComponent },
  { path: 'currency', component: CurrencyComponent },
  { path: 'etf', component: EtfComponent },
  { path: 'stockindex', component: IndexComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
