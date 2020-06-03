import { HistoricalPrice } from './../../models/historical-price.model';
import { Component, OnInit } from '@angular/core';
import { ETFInfoPrice } from './../../models/etf-info-price.model';
import { PriceApiService } from 'src/app/services/price-api.service';

@Component({
  selector: 'rate-etf',
  templateUrl: './etf.component.html',
  styleUrls: ['./etf.component.less']
})
export class EtfComponent implements OnInit {

  private error: any;
  public info: Array<ETFInfoPrice>;
  public shortcuts = [
    'RSP',
    'QQQ',
    'EFG',
    'DIA',
    'RPG',
    'VTI',
    'IWM',
    'PRF',
    'MDY',
    'IWM',
    'EEM',
    'EWJ'

  ];
  importantETFs: Array<Array<HistoricalPrice>>;

  constructor(private api: PriceApiService) { }

  getETFInfo(shortcut: string) {
    this.api.getETFInfo(shortcut).subscribe(
      (infoPrice: Array<ETFInfoPrice>) => {
        this.info = infoPrice;
      },
      error => this.error = error
    );
  }

  ngOnInit(): void {
  }

}
