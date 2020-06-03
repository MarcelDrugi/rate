import { Component, OnInit } from '@angular/core';
import { PriceApiService } from 'src/app/services/price-api.service';
import { CurrentIndexPrice } from 'src/app/models/current-index-price.model';

@Component({
  selector: 'rate-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

  public prices: Array<CurrentIndexPrice>;
  private error: any;
  public shortcuts = {
    'Dow Jones': 'US30',
    'S&P 500': 'US500',
    'NASDAQ': 'US100',
    'CBOE': 'CBOE'
  };

  constructor(private apiPrice: PriceApiService) { }

  getCurrentPrices(): void {
    this.prices = [];
    for (const shortcut of Object.keys(this.shortcuts)) {
      this.apiPrice.getCurrentIndexPrice(shortcut).subscribe(
        (price: CurrentIndexPrice) => {
          this.prices.push(price);
        },
        error => this.error = error
      );
    }
  }


  ngOnInit(): void {
  }

}
