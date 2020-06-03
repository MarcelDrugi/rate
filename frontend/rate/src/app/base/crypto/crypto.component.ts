import { Component, OnInit } from '@angular/core';
import { CryptoInfoPrice } from '../../models/crypto-info-price.model';
import { PriceApiService } from 'src/app/services/price-api.service';

@Component({
  selector: 'rate-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.less']
})
export class CryptoComponent implements OnInit {

  private error: any;
  public info: CryptoInfoPrice;
  public shortcuts = [
    'bitcoin',
    'eos',
    'ethereum',
    'ripple',
    'tether',
    'chainlink',
    'dash',
    'maza'
  ];

  constructor(private apiPrice: PriceApiService) { }

  getCryptoInfo(shortcut: string): void {
    this.info = new CryptoInfoPrice();
    this.apiPrice.getCryptoInfo(shortcut).subscribe(
      (info: any) => {
        this.info.name = info['name'];
        this.info.image = info['image']['large'];
        this.info.description = info['description']['en'];
        this.info.blockTime = info['block_time_in_minutes'];
        this.info.genesisDate = info['genesis_date'];
        this.info.homepage = info['links']['homepage'][0];
        this.info.pricePLN = info['market_data']['current_price']['pln']
        this.info.priceUSD = info['market_data']['current_price']['usd']
      },
      error => this.error = error
    );
  }

  ngOnInit(): void {
  }

}
