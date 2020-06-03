import { CurrentIndexPrice } from './../../models/current-index-price.model';
import { Component, OnInit, ElementRef } from '@angular/core';
import { PriceApiService } from 'src/app/services/price-api.service';
import { HistoricalPrice } from '../../models/historical-price.model';
import * as d3 from 'd3';
import { CurrentPrice } from 'src/app/models/current-price.model';
import { ETFInfoPrice } from 'src/app/models/etf-info-price.model';
import { CommoditiesInfoPrice } from 'src/app/models/commoditie-info-price.model';
import { CryptoInfoPrice } from 'src/app/models/crypto-info-price.model';
import * as moment from 'moment';


@Component({
  selector: 'rate-volume',
  templateUrl: './volume.component.html',
  styleUrls: ['./volume.component.less']
})
export class VolumeComponent implements OnInit {

  private historicalVolume: Array<HistoricalPrice>;
  private fullData: Array<HistoricalPrice>;
  private error: any;
  private shortcut = 'AAPL';
  private displayRange = 'full';
  private initCanvaName = 'canvaVol';
  public canvaClass: string;
  public showLoadingBar = false;
  private notExist = true;
  private kindMethod: any;
  private kindCurrentMethod: any;
  public displayedContent: any;
  public showLeadPrice: boolean;
  private breakIntervalId: ReturnType<typeof setTimeout>;

  public stockError = false;
  public ETFError = false;

  constructor(private api: PriceApiService, private eltRef: ElementRef) { }

  ngOnInit(): void {
    this.canvaClass = this.initCanvaName;
    // this.run(this.displayRange, this.shortcut);
  }
  run(displayRange: string, companyShortut: string, kind: string, newData: boolean): void {
    this.displayRange = displayRange;
    this.shortcut = companyShortut;
    this.notExist = true;
    this.ETFError = false;
    this.stockError = false;
    this.showData(kind, newData);
  }

  getHistoricalStockPrice(shortcut: string, interval: string, newData: boolean, callback: () => void): ReturnType<() => void> | void {
    this.api.getHistoricalStockPrice(shortcut, interval).subscribe(
      (historical: Array<any>) => {
        this.historicalVolume = [];
        let skip: number;
        if (interval === 'full' ) {
          skip = 8;
        }
        else if (interval === '1min' ) {
          skip = 8;
        }
        else if (interval === '15min' ) {
          skip = 1;
        }
        else if (interval === '1hour' ){
          skip = 3;
        }
        historical['c'].filter((element, i: number) => i % skip === 0).forEach((element, i) => {
          this.historicalVolume.push({
            c: element,
            t: new Date(historical['t'][i * skip] * 1000).toISOString(),
            o: historical['o'][i * skip],
            h: historical['h'][i * skip],
            l: historical['l'][i * skip],
            v: historical['v'][i * skip]
          });
        });
        return callback();
      },
      error => {
        if (error.status === 429) {
          this.stockError = true;
        }
      }
    );
  }

  getCurrentStockPrices(shortcut: string): void {
    this.api.getCurrentStockPrice(shortcut).subscribe(
      (price: CurrentPrice) => {
        this.displayedContent = price;
      },
      error => {
        if (error.status === 429) {
          this.stockError = true;
        }
      }
    );
  }

  getCurrentIndexPrice(shortcut: string) {
    this.api.getCurrentIndexPrice(shortcut).subscribe(
      (infoPrice: CurrentIndexPrice) => {
        this.displayedContent = new CurrentIndexPrice(true, parseFloat(infoPrice[0]['p']));
      },
      error => this.error = error
    );
  }

  getHistoricalIndexPrice(shortcut: string, interval: string, newData: boolean, callback: () => void): ReturnType<() => void> | void {
    this.historicalVolume = [];
    let skip: number;
    this.api.getHistoricalIndexPrice(shortcut, interval).subscribe(
      (historical: any) => {
        if (interval === 'full' ) {
          skip = 2;
        }
        else if (interval === '1min' ) {
          if (shortcut === 'CBOE'){
            skip = 2;
          }
          else {
            skip = 1;
          }
        }
        else if (interval === '15min' ) {
          if (shortcut === 'CBOE'){
            skip = 2;
          }
          else {
            skip = 1;
          }
        }
        else if (interval === '1hour' ){
          if (shortcut === 'CBOE'){
            skip = 5;
          }
          else {
            skip = 4;
          }
        }
        historical.filter((element, i: number) => i % skip === 0).forEach(element => {
          this.historicalVolume.push({
            t: new Date(element[0]).toISOString(),
            o: parseFloat(element[4]),
            l: parseFloat(element[2]),
            h: parseFloat(element[3]),
            c: parseFloat(element[1]),
            v: parseFloat(element[5])
          });
        });
        return callback();
      },
      error => this.error = error
    );
  }

  getETFInfoPrice(shortcut: string): void {
    this.api.getHistoricalETFPrice(shortcut, 'now').subscribe(
      (current: any) => {
        if (current['code']) {
          this.ETFError = true;
        }
        else {
          this.displayedContent = {
            symbol: 'X',
            price: current['values'][0]['close']
          };
        }
      });
  }

  getHistoricalETFPrice(shortcut: string, interval: string, newData: boolean, callback: () => void): ReturnType<() => void> | void {
    let skip: number;
    let range: number;
    if (interval === 'full' ) {
      skip = 1;
      range = 90;
      newData = true;
    }
    else if (interval === '1min' ) {
      skip = 1;
      range = 45;
    }
    else if (interval === '15min' ) {
      skip = 3;
      range = 77;
    }
    else if (interval === '1hour' ){
      skip = 10;
      range = 650;
    }
    // checking the length of the array to recognize the previous data set
    if (newData || this.fullData?.length < 100) {
      this.api.getHistoricalETFPrice(shortcut, interval).subscribe(
        (historical: any) => {
          if (historical['code']) {
            this.ETFError = true;
          }
          else{
            historical = historical['values'];
            this.fullData = historical;
            this.historicalVolume = [];
            historical.filter((element, i: number) => i % skip === 0).slice(0, range).forEach((element, i) => {
              this.historicalVolume.push({
                c: parseFloat(element['close']),
                t: element['datetime'],
                o: parseFloat(element['open']),
                h: parseFloat(element['high']),
                l: parseFloat(element['low']),
                v: parseFloat(element['volume'])
              });
            });
            return callback();
          }
        },
        error => {this.error = error; console.log('BŁĄD: ', error.status);}
      );
    }
    else {
      this.historicalVolume = [];
      this.fullData.filter((element, i: number) => i % skip === 0).slice(0, range).forEach((element, i) => {
        this.historicalVolume.push({
          c: parseFloat(element['close']),
          t: element['datetime'],
          o: parseFloat(element['open']),
          h: parseFloat(element['high']),
          l: parseFloat(element['low']),
          v: parseFloat(element['volume'])
        });
      });
      return callback();
    }
  }

  getCryptoInfo(shortcut: string) {
    this.api.getCryptoInfo(shortcut).subscribe(
      (infoPrice: any) => {
        this.displayedContent = { c: infoPrice['market_data']['current_price']['usd'] };
      },
      error => this.error = error
    );
  }

  getHistoricalCryptoPrice(shortcut: string, interval: string, newData: boolean, callback: () => void): ReturnType<() => void> | void {
    this.historicalVolume = [];
    this.api.getHistoricalCryptoPrice(shortcut, interval).subscribe(
      (historical: any) => {
        this.historicalVolume = [];
        let skip: number;
        if (interval === 'full' ) {
          skip = 12;
        }
        else if (interval === '1min' ) {
          skip = 1;
        }
        else if (interval === '15min' ) {
          skip = 2;
        }
        else if (interval === '1hour' ){
          skip = 6;
        }
        historical['prices'].filter((element, i: number) => i % skip === 0).forEach((element, i) => {
          this.historicalVolume.push({
            c: element[1],
            t: new Date(historical['market_caps'][i * skip][0] ).toISOString(),
            o: null,
            h: null,
            l: null,
            v: historical['total_volumes'][i * skip][1]
          });
        });
        return callback();
      },
      error => this.error = error
    );
  }

  showData(kind: string, newData: boolean): void {
    // initial graph draw
    this.showLoadingBar = true;
    this.showLeadPrice = true;
    if (kind === 'stock' || kind === 'homepage') {
      this.kindMethod = this.getHistoricalStockPrice;
      this.kindCurrentMethod = this.getCurrentStockPrices;
    }
    else if (kind === 'index') {
      this.showLeadPrice = true;
      this.kindMethod = this.getHistoricalIndexPrice;
      this.kindCurrentMethod = this.getCurrentIndexPrice;
    }
    else if (kind === 'etf') {
      this.kindMethod = this.getHistoricalETFPrice;
      this.kindCurrentMethod = this.getETFInfoPrice;
    }
    else if (kind === 'crypto') {
      this.kindMethod = this.getHistoricalCryptoPrice;
      this.kindCurrentMethod = this.getCryptoInfo;
    }
    clearInterval(this.breakIntervalId);
    this.kindMethod(
      this.shortcut, this.displayRange, newData,
      (() => this.cleanAndDraw(() => this.drawPrice()))
    );
    this.kindCurrentMethod(this.shortcut);

    // update price and graph every 60s
    this.breakIntervalId = setInterval(() => {
      this.kindMethod(
        this.shortcut, this.displayRange, newData,
        (() => this.cleanAndDraw(() => this.drawPrice()))
      );
      this.kindCurrentMethod(this.shortcut);
      },
      60000
    );
  }

  cleanAndDraw(callback: () => void): ReturnType<() => void> {
    this.canvaClass = this.initCanvaName;
    d3.select(this.eltRef.nativeElement).select('.' + this.canvaClass).select('svg').remove();

    return callback();
  }

  breakDraw() {
    d3.select(this.eltRef.nativeElement).select('.' + this.canvaClass).select('svg').remove();
    clearInterval(this.breakIntervalId);
  }

  drawPrice(): void {
    this.showLoadingBar = false;
    const barWidth = this.historicalVolume.length / 20;

    const svgWidth = this.eltRef.nativeElement.getBoundingClientRect().width;
    const svgHeight = this.eltRef.nativeElement.parentNode.getBoundingClientRect().height * 0.824;


    const margin = { top: 50, right: svgWidth * 0.05 , bottom: 30, left: svgWidth * 0.081 };
    // dynamic label position correction
    const xLabelCorr = 60;
    const yLabelCorr = 35;
    // dyunamic label size
    const xLbelSize = 168;
    const yLabelSize = 50;

    // label font
    const labelFont = 'Arial';

    const canva =  d3.select(this.eltRef.nativeElement).select('.' + this.canvaClass);

    const svg = canva.append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const yScale = d3.scaleLinear()
      .domain([d3.max(this.historicalVolume, d => d.v), 0])
      .range([margin.bottom, svgHeight - margin.top]);

    const xScale = d3.scaleTime()
      .domain([
        d3.min(this.historicalVolume, d => new Date(d.t)),
        d3.max(this.historicalVolume, d => new Date(d.t))
      ])
      .range([margin.left, svgWidth - margin.right]);

    const myFormat = d3.timeFormat('%d.%m.%Y');
    const xAxis = d3.axisBottom(xScale).tickFormat(myFormat).ticks(7);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('transform', 'translate(' + [margin.left, 0] + ')')
      .call(yAxis);

    const xAxisTranslate = svgHeight - margin.top;

    svg.append('g')
      .attr('transform', 'translate(' + [0, xAxisTranslate] + ')')
      .call(xAxis);

    if (this.notExist) {
      this.notExist = false;
      svg.selectAll('.bar')
        .data(this.historicalVolume)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', (g: HistoricalPrice) => xScale(new Date(g.t)))
        .attr('width', barWidth)
        .attr('y', (g: HistoricalPrice) => (svgHeight - margin.top))
        .attr('height', (g: HistoricalPrice) => 0)
        .attr('rx', 1)
        .attr('ry', 1)
        .attr('id', d => '' + d.v + d.t)
        .on('mouseover', showBar.bind(this))
        .on('mouseout', normalBar.bind(this))
        .transition()
        .duration(1200)
        .attr('y', (g: HistoricalPrice) => (svgHeight - (svgHeight - yScale(g.v))))
        .attr('height', (g: HistoricalPrice) => svgHeight - margin.top - yScale(g.v));
    }
    else {
      svg.selectAll('.bar')
        .data(this.historicalVolume)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', (g: HistoricalPrice) => xScale(new Date(g.t)))
        .attr('width', barWidth)
        .attr('y', (g: HistoricalPrice) => (svgHeight - (svgHeight - yScale(g.v))))
        .attr('height', (g: HistoricalPrice) => svgHeight - margin.top - yScale(g.v))
        .attr('rx', 1)
        .attr('ry', 1)
        .attr('id', d => '' + d.v + d.t)
        .on('mouseover', showBar.bind(this))
        .on('mouseout', normalBar.bind(this));
    }

    function showBar(myBar: HistoricalPrice): void{
      svg.append('rect')
        .attr('x', () => {
          const x = xScale(new Date(myBar.t));
          if  (x < svgWidth * 0.9) {
            return x - xLabelCorr;
          }
          else {
            return x - 130;
          }
        })
        .attr('y', 5)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('width', xLbelSize)
        .attr('height', yLabelSize)
        .attr('class', 'bigBar');
      svg.append('text')
        .attr('class', 'bigBarText')
        .attr('x', () => {
          const x = xScale(new Date(myBar.t));
          if  (x < svgWidth * 0.9) {
            return x - xLabelCorr + 10;
          }
          else {
            return x - 120;
          }
        })
        .attr('y', 25)
        .attr('font-family', labelFont)
        .text(moment(myBar.t).format('MM/DD/YYYY, h:mm a'));
      svg.append('text')
        .attr('class', 'bigBarText')
        .attr('x', () => {
          const x = xScale(new Date(myBar.t));
          if  (x < svgWidth * 0.9) {
            return x - xLabelCorr + 10;
          }
          else {
            return x - 120;
          }
        })
        .attr('y', 45)
        .attr('font-family', labelFont)
        .text('vol: ' + myBar.v.toFixed(1));
      const id = '' + myBar.v + myBar.t;
      svg.select('#' + CSS.escape(id))
        .attr('width', barWidth * 1.5)
        .attr('class', 'activeBar');

      this.canvaClass += ' canva-hooverBar';
    }

    function normalBar(myBar: HistoricalPrice): void {
      svg.selectAll('.bigBar').remove();
      svg.selectAll('.bigBarText').remove();
      const id = '' + myBar.v + myBar.t;
      svg.select('#' + CSS.escape(id))
        .attr('width', barWidth)
        .attr('class', 'bar');

      this.canvaClass = 'canvaVol';
    }
  }
}
