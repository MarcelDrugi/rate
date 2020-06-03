import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseComponent } from './base/base.component';
import { HomepageComponent } from './base/homepage/homepage.component';
import { AboutComponent } from './base/about/about.component';
import { StockComponent } from './base/stock/stock.component';
import { IndexComponent } from './base/index/index.component';
import { NewsComponent } from './base/news/news.component';
import { EtfComponent } from './base/etf/etf.component';
import { CryptoComponent } from './base/crypto/crypto.component';
import { CurrencyComponent } from './base/currency/currency.component';
import { CostComponent } from './base/cost/cost.component';
import { VolumeComponent } from './base/volume/volume.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TinyGraphComponent } from './base/tiny-graph/tiny-graph.component';
import { NewsDirective } from './directives/news.directive';



@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    HomepageComponent,
    AboutComponent,
    StockComponent,
    IndexComponent,
    NewsComponent,
    EtfComponent,
    CryptoComponent,
    CurrencyComponent,
    CostComponent,
    VolumeComponent,
    TinyGraphComponent,
    NewsDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
