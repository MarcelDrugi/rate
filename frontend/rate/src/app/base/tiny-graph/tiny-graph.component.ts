import { Observable } from 'rxjs';
import { Component, OnInit, ElementRef } from '@angular/core';
import { CurrentPrice } from '../../models/current-price.model';
import { HistoricalPrice } from '../../models/historical-price.model';
import * as d3 from 'd3';
import { PriceApiService } from 'src/app/services/price-api.service';
import { bindCallback } from 'rxjs';
import { ETFInfoPrice } from 'src/app/models/etf-info-price.model';
import { CurrentIndexPrice } from 'src/app/models/current-index-price.model';
import { CryptoInfoPrice } from 'src/app/models/crypto-info-price.model';


@Component({
  selector: 'rate-tiny-graph',
  templateUrl: './tiny-graph.component.html',
  styleUrls: ['./tiny-graph.component.less']
})
export class TinyGraphComponent implements OnInit {

  private initCanvaName = 'miniCanva';
  public canvaClass: string;
  private graphIndex: number;
  private canvaNames = ['canva1', 'canva2', 'canva3', 'canva4'];
  private historicalPrice = new Array<Array<HistoricalPrice>>(4);
  private error: any;
  public pageLoader = 0;
  private currentPrice = new Array<CurrentPrice>(4);
  public shortcuts: Array<Array<string>> = [
    ['AAPL', 'AAPL'],
    ['RSP', 'RSP'],
    ['bitcoin', 'Bitcoin'],
    ['OANDA:EUR_USD', 'Euro']
  ];

  constructor(private api: PriceApiService, private eltRef: ElementRef) { }

  ngOnInit() {
    this.canvaClass = this.initCanvaName;
    this.showData();

  }

  getCurrentStockPrice(shortcut: string, callback: () => void): void {
      this.api.getCurrentStockPrice(shortcut).subscribe(
        (price: CurrentPrice) => {
          this.currentPrice[0] = price;
          return callback();
        },
        error => this.error = error
      );
  }

  getHistoricalStockPrice(shortcut: string, interval: string, callback: () => void): ReturnType<() => void> | void  {
    const singleHisorical: Array<HistoricalPrice> = [];
    const skip = 2;
    this.api.getHistoricalStockPrice(shortcut, interval).subscribe(
      (historical: Array<any>) => {
        historical['c'].filter((element, i: number) => i % skip === 0).forEach((element, i) => {
          singleHisorical.push({
            c: element,
            t: new Date(historical['t'][i * skip] * 1000).toISOString(),
            o: historical['o'][i * skip],
            h: historical['h'][i * skip],
            l: historical['l'][i * skip],
            v: historical['v'][i * skip]
          });
        });
        this.historicalPrice[0] = singleHisorical;
        return callback();
      },
      error => this.error = error
    );
  }

  getETFInfoPrice(shortcut: string, callback: () => void): void {
    this.api.getHistoricalETFPrice(shortcut, 'now').subscribe(
      (current: any) => {
        this.currentPrice[1] = new CurrentPrice();
        this.currentPrice[1].c = parseFloat(current['values'][0]['close']);
        return callback();
      });
  }

  getHistoricalETFPrice(shortcut: string, interval: string, callback: () => void): ReturnType<() => void> | void {
    const skip = 12;
    const range = 650;
    const singleHisorical: Array<HistoricalPrice> = [];

    this.api.getHistoricalETFPrice(shortcut, interval).subscribe(
      (historical: any) => {
        historical = historical['values'];
        historical.filter((element, i: number) => i % skip === 0).slice(0, range).forEach((element, i) => {
          singleHisorical.push({
            c: parseFloat(element['close']),
            t: element['datetime'],
            o: parseFloat(element['open']),
            h: parseFloat(element['high']),
            l: parseFloat(element['low']),
            v: parseFloat(element['volume'])
          });
        });
        this.historicalPrice[1] = singleHisorical;
        return callback();
    },
      error => this.error = error
    );
  }

  getCryptoInfo(shortcut: string, callback: () => void): void {
    this.api.getCryptoInfo(shortcut).subscribe(
      (infoPrice: any) => {
        this.currentPrice[2] = new CurrentPrice();
        this.currentPrice[2].c = parseFloat(infoPrice['market_data']['current_price']['usd']);
        return callback();
      },
      error => this.error = error
    );
  }

  getHistoricalCryptoPrice(shortcut: string, interval: string, callback: () => void): ReturnType<() => void> | void {
    const singleHisorical: Array<HistoricalPrice> = [];
    this.api.getHistoricalCryptoPrice(shortcut, interval).subscribe(
      (historical: any) => {
        const skip = 4;
        historical['prices'].filter((element, i: number) => i % skip === 0).forEach((element, i) => {
          singleHisorical.push({
            c: element[1],
            t: new Date(historical['market_caps'][i * skip][0] ).toISOString(),
            o: null,
            h: null,
            l: null,
            v: historical['total_volumes'][i * skip][1]
          });
        });
        this.historicalPrice[2] = singleHisorical;
        return callback();
      },
      error => this.error = error
    );
  }

  getCurrentCurrencyPrice(shortcut: string, callback: () => void): void {
    this.api.getCurrentCurrencyPrice(shortcut).subscribe(
      (price: CurrentPrice) => {
        this.currentPrice[3] = new CurrentPrice();
        this.currentPrice[3].c = price.c[0];
        return callback();
      },
      error => this.error = error
    );
  }

  getHistoricalCurrencyPrice(shortcut: string, interval: string, callback: () => void): ReturnType<() => void> | void {
    const singleHisorical: Array<HistoricalPrice> = [];
    this.api.getHistoricalCurrencyPrice(shortcut, interval).subscribe(
      (historical: Array<any>) => {
        const skip = 2;
        historical['c'].filter((element, i: number) => i % skip === 0).forEach((element, i) => {
          singleHisorical.push({
            c: element,
            t: new Date(historical['t'][i * skip] * 1000).toISOString(),
            o: historical['o'][i * skip],
            h: historical['h'][i * skip],
            l: historical['l'][i * skip],
            v: historical['v'][i * skip]
          });
        });
        this.historicalPrice[3] = singleHisorical;
        return callback();
      },
      error => this.error = error
    );
  }

  showData() {
    // takes data and draws mini-graphs
    this.getHistoricalStockPrice(
      this.shortcuts[0][0],
      '1hour',
      () => this.getCurrentStockPrice(this.shortcuts[0][0], () => this.drawPrice(this.canvaNames[0], this.shortcuts[0][1], 0))
    );
    this.getHistoricalETFPrice(
      this.shortcuts[1][0],
      '1hour',
      () => this.getETFInfoPrice(this.shortcuts[1][0], () => this.drawPrice(this.canvaNames[1], this.shortcuts[1][1], 1))
    );
    this.getHistoricalCryptoPrice(
      this.shortcuts[2][0],
      '1hour',
      () => this.getCryptoInfo(this.shortcuts[2][0], () => this.drawPrice(this.canvaNames[2], this.shortcuts[2][1], 2))
    );
    this.getHistoricalCurrencyPrice(
      this.shortcuts[3][0],
      '1hour',
      () => this.getCurrentCurrencyPrice(this.shortcuts[3][0], () => this.drawPrice(this.canvaNames[3], this.shortcuts[3][1], 3))
    );
  }

  drawPrice(canvaName: string, shortcut: string, hisId: number) {
    const svgWidth = window.innerWidth * 0.23;
    const svgHeight = window.innerHeight * 0.18;

    // dot dynamic label position correction
    const xLabelCorr = -20;
    const yLabelCorr = 45;

    // dot dynamic label size
    const xLbelSize = 295;
    const yLabelSize = 60;
    const lineSize = 18;

    // dot/pointer label font
    const dotFont = 'Arial';
    const pointerFont = 'Arial';

    // pointer dynamic label position correction
    const xSmallLabelCorr = 25;
    const ySmallLabelCorr = -25;

    // pointer dyunamic label size
    const xSmallLbelSize = 230;
    const ySmallLabelSize = 25;

    //  dots size
    const radius = 6;

    // axis date format
    const myFormat = d3.timeFormat('%d.%m.%Y');

    const margin = { top: 35, right: 60, bottom: 30, left: 44 };

    // svg init
    const canva =  d3.select(this.eltRef.nativeElement).select('.' + canvaName);
    const svg = canva.append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(this.historicalPrice[hisId], d => d.c),
        d3.max(this.historicalPrice[hisId], d => d.c)
      ])
      .range([svgHeight - margin.top, margin.bottom]);

    const xScale = d3.scaleTime()
    .domain([
      d3.min(this.historicalPrice[hisId], d => new Date(d.t)),
      d3.max(this.historicalPrice[hisId], d => new Date(d.t))
    ])
    .range([margin.left, svgWidth - margin.right]);

    const xAxis = d3.axisBottom(xScale).ticks(1).tickFormat(myFormat);
    const yAxis = d3.axisLeft(yScale).ticks(3);

    svg.append('g')
      .attr('transform', 'translate(' + [margin.left, 0] + ')')
      .call(yAxis);

    const xAxisTranslate = svgHeight - margin.top;

    svg.append('g')
      .attr('transform', 'translate(' + [0, xAxisTranslate] + ')')
      .call(xAxis);

    // price info
    svg
      .append('circle')
      .attr('class', 'smallDot')
      .attr('cx', svgWidth * 0.49)
      .attr('cy', svgHeight * 0.96)
      .attr('r', radius)
      .attr('fill', 'red');

    function repeat() {
      svg.selectAll('.smallDot')
        .transition()
        .duration(600)
        .attr('fill', 'darkred')
        .transition()
        .duration(600)
        .attr('fill', 'red')
        .on('end', repeat);
    }
    repeat();

    svg.append('text')
      .attr('class', 'bigDotText')
      .attr('x', svgWidth * 0.52)
      .attr('y', svgHeight)
      .text(this.currentPrice[hisId].c.toFixed(2) + '$');

    svg.append('text')
      .attr('class', 'bigDotText')
      .attr('x', svgWidth * 0.23)
      .attr('y', svgHeight)
      .text(shortcut);

    // add area
    const area = d3.area<HistoricalPrice>()
      .x((d: HistoricalPrice) => xScale(new Date(d.t)))
      .y0(svgHeight - margin.bottom)
      .y1((d: HistoricalPrice) => yScale(d.c));

    svg.append('path')
      .datum(this.historicalPrice[hisId])
      .attr('class', 'area')
      .attr('d', area);


    // add line
    const line = d3.line<HistoricalPrice>()
      .x((d: HistoricalPrice) => xScale(new Date(d.t)))
      .y((d: HistoricalPrice) => yScale(d.c));

    svg.append('path')
      .datum(this.historicalPrice[hisId])
      .attr('class', 'line')
      .attr('d', line);

    this.pageLoader++;
  }
}



