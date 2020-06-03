import { Component, OnInit, ElementRef} from '@angular/core';
import { InfoApiService } from 'src/app/services/info-api.service';
import { StockInfo } from '../../models/stock-info.model';
import { PriceApiService } from 'src/app/services/price-api.service';
import { CurrentPrice } from '../../models/current-price.model';


@Component({
  selector: 'rate-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.less']
})
export class StockComponent implements OnInit {

  private error: any;
  public info: StockInfo;
  public currentPrice: CurrentPrice;
  public prices: Array<CurrentPrice>;
  public stockError = false;
  public shortcuts = [
    'AAPL',
    'ADBE',
    'MSFT',
    'AMZN',
    'VLO',
    'FB',
    'FDX',
    'V',
    'MA',
    'INTC',
    'GE',
    'NFLX',
    'KO',
    'FCAU',
    'CVX',
    'AXP',
    'TSLA',
    'NKE',
    'MCD',
    'GM',
    'JPM',
  ];

  constructor(
    private apiInfo: InfoApiService,
    private apiPrice: PriceApiService
    ) { }

  getCompanyInfo(shortcut: string): void {
    this.apiInfo.getCompanyInfo(shortcut).subscribe(
      (info: any) => {
        this.info = info;
      },
      error => {
        if (error.status === 429) {
          this.stockError = true;
        }
      }
    );
  }

  getCurrentPrices(): void {
    this.prices = Array<CurrentPrice>(6);
    this.shortcuts.slice(1, 7).forEach((element: string, i: number) => {
      this.apiPrice.getCurrentStockPrice(element).subscribe(
        (price: CurrentPrice) => {
          this.prices[i] = price;
        },
        error => {
          if (error.status === 429) {
            this.stockError = true;
          }
        }
      );
    });
  }

  showInfo(shortcut: string) {
    this.stockError = false;
    this.getCompanyInfo(shortcut);
  }

  showPrices() {
    this.stockError = false;
    this.getCurrentPrices();
  }


  ngOnInit() {
  }

}
