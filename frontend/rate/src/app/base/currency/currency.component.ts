import { Component, OnInit } from '@angular/core';
import { PriceApiService } from 'src/app/services/price-api.service';
import { CurrencyInfoPrice } from 'src/app/models/currency-info-price.model';

@Component({
  selector: 'rate-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.less']
})
export class CurrencyComponent implements OnInit {

  private error: any;
  public info: CurrencyInfoPrice;
  public currencySymbols: Array<string>;
  public shortcuts = {
    'EUR/USD': 'OANDA:EUR_USD',
    'GBP/USD': 'OANDA:GBP_USD',
    'EUR/GBP': 'OANDA:EUR_GBP',
    'USD/JPY': 'OANDA:USD_JPY',
    'EUR/PLN': 'OANDA:EUR_PLN',
    'USD/PLN': 'OANDA:USD_PLN',
    'GBP/PLN': 'OANDA:GBP_PLN',
    'USD/CAD': 'OANDA:USD_CAD',
    'Uncja złota/EUR': 'OANDA:XAU_EUR',
    'Uncja srebra/EUR': 'OANDA:XAG_EUR',
  };


  constructor(private api: PriceApiService) { }

  getCurrecyInfo(): void {
    this.currencySymbols = [];
    this.api.getCurrencyInfo().subscribe(
      (infoPrice: CurrencyInfoPrice) => {
        this.info = infoPrice;
        for (const key in this.info.quote) {
          if (this.info.quote.hasOwnProperty(key)) {
            this.currencySymbols.push(key);
          }
        }
      },
      error => this.error = error
    );
  }

  ngOnInit(): void {
  }

}
