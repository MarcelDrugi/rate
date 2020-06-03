import { Component, OnInit, ElementRef} from '@angular/core';
import { PriceApiService } from 'src/app/services/price-api.service';
import { HistoricalPrice } from '../../models/historical-price.model';
import * as d3 from 'd3';
import { CurrentIndexPrice } from 'src/app/models/current-index-price.model';
import { CurrentPrice } from 'src/app/models/current-price.model';
import { CryptoInfoPrice } from 'src/app/models/crypto-info-price.model';
import * as moment from 'moment';




@Component({
  selector: 'rate-cost',
  templateUrl: './cost.component.html',
  styleUrls: ['./cost.component.less'],
})
export class CostComponent implements OnInit{

  private historicalPrice: Array<HistoricalPrice>;
  private fullData: Array<HistoricalPrice>;
  private error = false;
  private shortcut = 'AAPL';
  private displayRange = 'full';
  private initCanvaName = 'canvaPrice';
  public showLoadingBar = false;
  public canvaClass: string;
  private firstTimeDots = true;
  private firstTimeLine = true;
  private firstTimeArea = true;
  private kindMethod: any;
  private kindCurrentMethod: any;
  public displayedContent: any;
  public dollarSign = true;
  private breakIntervalId: ReturnType<typeof setTimeout>;

  public stockError = false;
  public ETFError = false;


  constructor(private api: PriceApiService, private eltRef: ElementRef) { }

  ngOnInit(): void {
    this.canvaClass = this.initCanvaName;
  }

  run(displayRange: string, companyShortut: string, kind: string, newData: boolean): void {
    this.displayRange = displayRange;
    this.shortcut = companyShortut;
    this.firstTimeDots = true;
    this.firstTimeLine = true;
    this.firstTimeArea = true;
    this.dollarSign = true;
    this.ETFError = false;
    this.stockError = false;
    this.showData(kind, newData);
  }

  getHistoricalStockPrice(shortcut: string, interval: string, newData: boolean, callback: () => void): ReturnType<() => void> | void {
    this.api.getHistoricalStockPrice(shortcut, interval).subscribe(
      (historical: Array<any>) => {
        this.historicalPrice = [];
        let skip: number;
        if (interval === 'full' ) {
          skip = 7;
        }
        else if (interval === '1min' ) {
          skip = 7;
        }
        else if (interval === '15min' ) {
          skip = 1;
        }
        else if (interval === '1hour' ){
          skip = 2;
        }
        historical['c'].filter((element, i: number) => i % skip === 0).forEach((element, i) => {
          this.historicalPrice.push({
            c: element,
            t: new Date(historical['t'][i * skip] * 1000).toLocaleString('en-US', {timeZone: 'America/New_York'}),
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
          else {
            historical = historical['values'];
            this.fullData = historical;
            this.historicalPrice = [];
            historical.filter((element, i: number) => i % skip === 0).slice(0, range).forEach((element, i) => {
              this.historicalPrice.push({
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
        error => this.error = error
      );
    }
    else {
      this.historicalPrice = [];
      this.fullData.filter((element, i: number) => i % skip === 0).slice(0, range).forEach((element, i) => {
        this.historicalPrice.push({
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

  getCurrentIndexPrice(shortcut: string) {
    this.api.getCurrentIndexPrice(shortcut).subscribe(
      (infoPrice: CurrentIndexPrice) => {
        this.displayedContent = new CurrentIndexPrice(true, parseFloat(infoPrice[0]['p']));
      },
      error => this.error = error
    );
  }

  getHistoricalIndexPrice(shortcut: string, interval: string, newData: boolean, callback: () => void): ReturnType<() => void> | void {
    this.historicalPrice = [];
    let skip: number;
    this.api.getHistoricalIndexPrice(shortcut, interval).subscribe(
      (historical: Array<any>) => {
        if (interval === 'full' ) {
          skip = 2;
        }
        else if (interval === '1min' ) {
          skip = 1;
        }
        else if (interval === '15min' ) {
          skip = 1;
        }
        else if (interval === '1hour' ){
          skip = 3;
        }
        historical.filter((element, i: number) => i % skip === 0).forEach(element => {
          this.historicalPrice.push({
            t: new Date(element[0]).toLocaleString('en-US', {timeZone: 'America/New_York'}),
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

  getCurrentCurrencyPrice(shortcut: string) {
    this.displayedContent = new CurrentPrice();
    this.api.getCurrentCurrencyPrice(shortcut).subscribe(
      (price: CurrentPrice) => {
        this.displayedContent.c = price.c[0];
      },
      error => {
        if (error.status === 429) {
          this.stockError = true;
        }
      }
    );
  }

  getHistoricalCurrencyPrice(shortcut: string, interval: string, newData: boolean, callback: () => void): ReturnType<() => void> | void {
    this.api.getHistoricalCurrencyPrice(shortcut, interval).subscribe(
      (historical: Array<any>) => {
        this.historicalPrice = [];
        let skip: number;
        if (interval === 'full' ) {
          skip = 7;
        }
        else if (interval === '1min' ) {
          skip = 3;
        }
        else if (interval === '15min' ) {
          skip = 1;
        }
        else if (interval === '1hour' ){
          skip = 2;
        }
        historical['c'].filter((element, i: number) => i % skip === 0).forEach((element, i) => {
          this.historicalPrice.push({
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

  getCryptoInfo(shortcut: string) {
    this.api.getCryptoInfo(shortcut).subscribe(
      (infoPrice: any) => {
        this.displayedContent = { c: infoPrice['market_data']['current_price']['usd'] };
      },
      error => this.error = error
    );
  }

  getHistoricalCryptoPrice(shortcut: string, interval: string, newData: boolean, callback: () => void): ReturnType<() => void> | void {
    this.historicalPrice = [];
    this.api.getHistoricalCryptoPrice(shortcut, interval).subscribe(
      (historical: any) => {
        this.historicalPrice = [];
        let skip: number;
        if (interval === 'full' ) {
          skip = 9;
        }
        else if (interval === '1min' ) {
          skip = 1;
        }
        else if (interval === '15min' ) {
          skip = 1;
        }
        else if (interval === '1hour' ){
          skip = 4;
        }
        historical['prices'].filter((element, i: number) => i % skip === 0).forEach((element, i) => {
          this.historicalPrice.push({
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
    if (kind === 'stock' || kind === 'homepage') {
      this.kindMethod = this.getHistoricalStockPrice;
      this.kindCurrentMethod = this.getCurrentStockPrices;
    }
    else if (kind === 'index') {
      this.kindMethod = this.getHistoricalIndexPrice;
      this.kindCurrentMethod = this.getCurrentIndexPrice;
    }
    else if (kind === 'etf') {
      this.kindMethod = this.getHistoricalETFPrice;
      this.kindCurrentMethod = this.getETFInfoPrice;
    }
    else if (kind === 'currency') {
      this.dollarSign = false;
      this.kindMethod = this.getHistoricalCurrencyPrice;
      this.kindCurrentMethod = this.getCurrentCurrencyPrice;
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
    d3.select(this.eltRef.nativeElement).select('svg').remove();
    clearInterval(this.breakIntervalId);
  }

  drawPrice(): void {
    this.showLoadingBar = false;

    const svgWidth = this.eltRef.nativeElement.getBoundingClientRect().width;
    const svgHeight = this.eltRef.nativeElement.parentNode.getBoundingClientRect().height * 0.824;

    // dot dynamic label position correction
    const xLabelCorrR = -18;
    const xLabelCorrL = -261;
    const yLabelCorr = svgHeight * 0.088;

    // dot dynamic label size
    const xLbelSize = 243;
    const yLabelSize = 60;
    const lineSize = 18;

    // dot/pointer label font
    const dotFont = 'Arial';
    const pointerFont = 'Arial';

    // pointer dynamic label position correction
    const xSmallLabelCorrR = 25;
    const xSmallLabelCorrL = -265;
    const ySmallLabelCorr = -30;

    // pointer dynamic label size
    const xSmallLbelSize = 240;
    const ySmallLabelSize = 25;

    //  dots size
    const radius = 4;

    // axis date format
    const myFormat = d3.timeFormat('%d.%m.%Y');

    const margin = { top: 30, right: svgWidth * 0.05 , bottom: 30, left: svgWidth * 0.05 };

    // control vars
    let onDot = true;
    const dollar = this.dollarSign;

    // svg init
    const canva =  d3.select(this.eltRef.nativeElement).select('.' + this.canvaClass);

    const svg = canva.append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(this.historicalPrice, d => d.c),
        d3.max(this.historicalPrice, d => d.c)
      ])
      .range([svgHeight - margin.top, margin.bottom]);

    const xScale = d3.scaleTime()
    .domain([
      d3.min(this.historicalPrice, d => new Date(d.t)),
      d3.max(this.historicalPrice, d => new Date(d.t))
    ])
    .range([margin.left, svgWidth - margin.right]);

    const xAxis = d3.axisBottom(xScale).tickFormat(myFormat).ticks(7);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('transform', 'translate(' + [margin.left, 0] + ')')
      .call(yAxis);

    const xAxisTranslate = svgHeight - margin.top;

    svg.append('g')
      .attr('transform', 'translate(' + [0, xAxisTranslate] + ')')
      .call(xAxis);

    // add area
    const area = d3.area<HistoricalPrice>()
      .x((d: HistoricalPrice) => xScale(new Date(d.t)))
      .y0(svgHeight - margin.bottom)
      .y1((d: HistoricalPrice) => yScale(d.c));

    if (this.firstTimeArea) {
      this.firstTimeArea = false;
      svg.append('path')
        .datum(this.historicalPrice)
        .attr('class', 'area')
        .attr('d', d3.area<HistoricalPrice>()
          .x((g) => xScale(new Date(g.t)))
          .y(g => svgHeight - margin.bottom)
        )
        .transition()
        .duration(900)
        .attr('d', area);
    }
    else {
      svg.append('path')
        .datum(this.historicalPrice)
        .attr('class', 'area')
        .attr('d', area);
    }

    // add line
    const line = d3.line<HistoricalPrice>()
      .x((d: HistoricalPrice) => xScale(new Date(d.t)))
      .y((d: HistoricalPrice) => yScale(d.c));

    if (this.firstTimeLine) {
      this.firstTimeLine = false;
      svg.append('path')
        .datum(this.historicalPrice)
        .attr('class', 'line')
        .attr('d', d3.line<HistoricalPrice>()
          .x((g: HistoricalPrice) => xScale(new Date(g.t)))
          .y(g => svgHeight - margin.bottom)
        )
        .transition()
        .duration(900)
        .attr('d', line);
    }
    else {
      svg.append('path')
        .datum(this.historicalPrice)
        .attr('class', 'line')
        .attr('d', line);
    }

    // init dots
    if (this.firstTimeDots) {
      this.firstTimeDots = false;
      svg.selectAll('.dot')
        .data(this.historicalPrice)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (g: HistoricalPrice) => xScale(new Date(g.t)))
        .attr('cy', 0)
        .attr('r', radius)
        .attr('id', d => '' + d.c + d.t)
        .on('mouseover', showLabel.bind(this))
        .on('mouseout', delLabel.bind(this))
        .transition()
        .duration(1200)
        .attr('cx', (g: HistoricalPrice) => xScale(new Date(g.t)))
        .attr('cy', (d: HistoricalPrice) => yScale(d.c));
    }
    else{
      svg.selectAll('.dot')
        .data(this.historicalPrice)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (g: HistoricalPrice) => xScale(new Date(g.t)))
        .attr('cy', (d: HistoricalPrice) => yScale(d.c))
        .attr('r', radius)
        .attr('id', d => '' + d.c + d.t)
        .on('mouseover', showLabel.bind(this))
        .on('mouseout', delLabel.bind(this));
    }

    // showing/delete dot's label
    function showLabel(myPoint: HistoricalPrice): void {
      svg.selectAll('.smallLabelText').remove();
      svg.selectAll('.labelP').remove();
      onDot = false;
      svg.append('rect')
        .attr('x', () => {
          const x = xScale(new Date(myPoint.t));
          if (x > svgWidth * 0.5) {
            return x + xLabelCorrL;
          }
          return x - xLabelCorrR;
        })
        .attr('y', yScale(myPoint.c) - yLabelCorr)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('width', xLbelSize)
        .attr('height', yLabelSize)
        .attr('class', 'bigDot');

      svg.append('text')
        .attr('class', 'bigDotText')
        .attr('x', () => {
          const x = xScale(new Date(myPoint.t));
          if (x > svgWidth * 0.5) {
            return x + xLabelCorrL + 10;
          }
          return x - xLabelCorrR + 10;
        })
        .attr('y', yScale(myPoint.c) - yLabelCorr + lineSize)
        .attr('font-family', dotFont)
        .text(moment(myPoint.t).format('MM/DD/YYYY, h:mm a'));
      svg.append('text')
        .attr('class', 'bigDotText')
        .attr('x', () => {
          const x = xScale(new Date(myPoint.t));
          if (x > svgWidth * 0.5) {
            return x + xLabelCorrL + 10;
          }
          return x - xLabelCorrR + 10;
        })
        .attr('y', yScale(myPoint.c) - yLabelCorr + lineSize * 2)
        .attr('font-family', dotFont)
        .text('zamknięcie: ' + myPoint.c.toFixed(2) + '$');
      svg.append('text')
        .attr('class', 'bigDotText')
        .attr('x', () => {
          const x = xScale(new Date(myPoint.t));
          if (x > svgWidth * 0.5) {
            return x + xLabelCorrL + 10;
          }
          return x - xLabelCorrR + 10;
        })
        .attr('y', yScale(myPoint.c) - yLabelCorr + lineSize * 3)
        .attr('font-family', dotFont)
        .text( () => {
          if (myPoint.l) {
            return 'min.: ' + myPoint.l.toFixed(1) + '$' + ' \u00A0 max.:' + myPoint.h.toFixed(1) + '$';
          }
          else {
            return 'min.: no data' + ' \u00A0 max.: no data';
          }
        });


      const id = '' + myPoint.c + myPoint.t;

      svg.select('#' + CSS.escape(id))
        .attr('r', radius * 2)
        .attr('class', 'activeDot');

      this.canvaClass += ' canvaPrice-hoverPoint';
    }

    function delLabel(myPoint: HistoricalPrice): void {
      onDot = true;
      svg.selectAll('.bigDot').remove();
      svg.selectAll('.bigDotText').remove();
      const id = '' + myPoint.c + myPoint.t;
      svg.select('#' + CSS.escape(id))
        .attr('r', radius)
        .attr('class', 'dot');

      this.canvaClass = this.initCanvaName;
    }

    // mousemove label and pointer
    svg.on('mousemove', function(): void {
      if (onDot) {
        const coordinates = d3.mouse(this);
        const mx = coordinates[0];
        const my = coordinates[1];
        svg.selectAll('.labelP').remove();
        svg.selectAll('.smallLabelText').remove();
        svg.selectAll('.pointer').remove();
        svg.append('rect')
          .attr('x', () => {
            if (mx > svgWidth * 0.75) {
              return mx + xSmallLabelCorrL;
            }
            return mx + xSmallLabelCorrR;
          })
          .attr('y', my + ySmallLabelCorr)
          .attr('rx', 7)
          .attr('ry', 7)
          .attr('width', xSmallLbelSize)
          .attr('height', ySmallLabelSize)
          .attr('class', 'labelP');

        svg.append('text')
          .attr('x', () => {
            if (mx > svgWidth * 0.75) {
              return mx + xSmallLabelCorrL + 5;
            }
            return mx + xSmallLabelCorrR + 5;
          })
          .attr('y', my + ySmallLabelCorr + 17)
          .attr('font-family', pointerFont)
          .text(new Date(xScale.invert(mx)).toLocaleString() + ' - ' + yScale.invert(my).toFixed(1) + '$')
          .attr('class', 'smallLabelText');

        svg.append('line')
          .attr('x1', mx)
          .attr('x2', mx)
          .attr('y1', my)
          .attr('y2', svgHeight - margin.bottom)
          .attr('width', 2)
          .attr('class', 'pointer');

        svg.append('line')
          .attr('x1', margin.left)
          .attr('x2', mx)
          .attr('y1', my)
          .attr('y2', my)
          .attr('width', 2)
          .attr('class', 'pointer');
      }
    });

    // mouse leaving grapph event
    svg.on('mouseleave', () => {
      svg.selectAll('.labelP').remove();
      svg.selectAll('.smallLabelText').remove();
      svg.selectAll('.pointer').remove();
    });
  }
}
