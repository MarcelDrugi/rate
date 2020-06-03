import { VolumeComponent } from './volume/volume.component';
import { CostComponent } from './cost/cost.component';
import { PriceApiService } from './../services/price-api.service';
import { InfoApiService} from './../services/info-api.service';
import { TopBarPrice } from '../models/top-bar-price.model';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import * as d3 from 'd3';


@Component({
  selector: 'rate-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.less'],
  providers: [
    PriceApiService,
    InfoApiService,
    Location
  ]
})
export class BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(CostComponent)
    costComp: CostComponent;
  @ViewChild(VolumeComponent)
    volComp: VolumeComponent;

  public warsawTime: Date;
  public newYorkTime: Date;
  public londonTime: Date;
  public shortcut: string;
  public displayRange: string;
  private showFirstGraph = true;
  public contentType: string;
  public volumePrice = 'price';
  private apiError: any;
  public graphType: string;
  public shortcuts = Array<string>();
  public navbarClass = 'navbar is-dark';
  public topBarPrices: Array<TopBarPrice>;
  public childContentClass: string;
  private HTMLElement: HTMLElement;
  private HTMLElements: HTMLCollectionOf<HTMLElement>;

  // invo bar
  public runningBarClass = new Array<string>(5).fill('');
  private barClassBasicName = 'infoEl';

  // drawing dot
  private canvaClassBig = 'cavaBigDot';
  private childComp: any;

  constructor(
    public router: Router,
    private eltRef: ElementRef,
    private apiPrice: PriceApiService
    ) {
    setInterval(() => {
      this.warsawTime = new Date();
      this.newYorkTime = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/New_York'}));
      this.londonTime = new Date(new Date().toLocaleString('en-US', {timeZone: 'Europe/London'}));
    }, 1000);
  }

  getTopBarPrice(showPriceCallback: () => void): ReturnType<() => void> {
    this.topBarPrices = [];
    const shortcuts = ['FB', 'JNJ', 'AMZN', 'BABA', 'JPM'];
    shortcuts.forEach((shortcut: string, i) => {
      this.apiPrice.getTopBarPrice(shortcut).subscribe(
        (price: any) => {
          this.topBarPrices.push(price['quote']);
          return showPriceCallback();
        },
        error => this.apiError = error
      );
    });
  }

  singleRun(i: number) {
    this.runningBarClass[i] = this.barClassBasicName + i;
    setTimeout(() => { this.runningBarClass[i] += ' go'; }, 100);
  }

  runBar(){
    this.runningBarClass.forEach((element: string, i: number) => {
      setTimeout(() => { this.singleRun(i); }, i * 3000);
    });
    this.runningBarClass.forEach((element: string, i: number) => {
      setTimeout(() => { setInterval(() => this.singleRun(i), 15200); }, i * 3000);
    });
  }

  submitRangeShortcut(newData: boolean): void {
    let kind: string;
    if (this.contentType === 'stock') {
      kind = 'stock';
      this.childComp.showInfo(this.shortcut);
    }
    else if (this.contentType === 'index') {
      kind = 'index';
    }
    else if (this.contentType === 'etf') {
      kind = 'etf';
      if (newData) {
        this.childComp.getETFInfo(this.shortcut);
      }
    }
    else if (this.contentType === 'currency') {
      kind = 'currency';
    }
    else if (this.contentType === 'news') {
      kind = 'news';
    }
    else if (this.contentType === 'crypto') {
      kind = 'crypto';
      this.childComp.getCryptoInfo(this.shortcut);
    }
    if (this.graphType === 'price') {
      if (this.contentType === 'currency' || this.contentType === 'index') {
        this.costComp.run(this.displayRange, this.childComp.shortcuts[this.shortcut], kind, newData);
      }
      else {
        this.costComp.run(this.displayRange, this.shortcut, kind, newData);
      }
    }
    else if (this.graphType === 'volume') {
      if (this.contentType === 'index') {
        this.volComp.run(this.displayRange, this.childComp.shortcuts[this.shortcut], kind, newData);
      }
      else {
        this.volComp.run(this.displayRange, this.shortcut, kind, newData);
      }
    }
  }

  submitType(event: string): void  {
    this.graphType = event;
    let kind: string;

    if (this.contentType === 'stock') {
      kind = 'stock';
    }
    else if (this.contentType === 'index') {
      kind = 'index';
    }
    else if (this.contentType === 'etf') {
      kind = 'etf';
    }
    else if (this.contentType === 'news') {
      kind = 'news';
    }
    else if (this.contentType === 'crypto') {
      kind = 'crypto';
    }
    if (this.graphType === 'price') {
      this.volComp.breakDraw();
      delete this.volComp.displayedContent;
      if (this.contentType === 'index') {
        this.costComp.run(this.displayRange, this.childComp.shortcuts[this.shortcut], kind, true);
      }
      else {
        this.costComp.run(this.displayRange, this.shortcut, kind, true);
      }
    }
    else if (this.graphType === 'volume') {
      this.costComp.breakDraw();
      delete this.costComp.displayedContent;
      if (this.contentType === 'index') {
        this.volComp.run(this.displayRange, this.childComp.shortcuts[this.shortcut], kind, true);
      }
      else {
        this.volComp.run(this.displayRange, this.shortcut, kind, true);
      }
    }
  }

  changeIndex(shortcut: string, i: string) {
    this.HTMLElements = document.getElementsByClassName('button') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < this.HTMLElements.length; i++) {
      this.HTMLElements[i].className = 'button is-medium';
    } // ES6 notation doesnt work for some reason

    this.HTMLElement = document.getElementById(i) as HTMLElement;
    this.HTMLElement.className += ' button-clicked';
    this.shortcut = shortcut;
    this.submitRangeShortcut(true);
  }

  drawBigDot(): void {
    const svgWidth = 50;
    const svgHeight = 50;
    const radius = 8;

    // svg init
    const canva =  d3.select(this.eltRef.nativeElement).select('.' + this.canvaClassBig);
    const svg = canva.append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    // dot
    svg
      .append('circle')
      .attr('class', 'bigDot')
      .attr('cx', 0 + radius)
      .attr('cy', svgHeight * 0.4)
      .attr('r', radius)
      .attr('fill', 'red');

    function repeat() {
      svg.selectAll('.bigDot')
        .transition()
        .duration(1000)
        .attr('cx', svgHeight - radius)
        .attr('fill', 'darkred')
        .transition()
        .duration(1000)
        .attr('cx', 0 + radius)
        .attr('fill', 'red')
        .on('end', repeat);
    }
    repeat();
  }

  onActivate(childComp) {
    this.childComp = childComp;
    const url = this.router.url;
    this.graphType = 'price';
    this.displayRange = 'full';
    this.volumePrice = 'price';
    this.volComp.breakDraw();
    this.costComp.breakDraw();
    if (url  === '/stock') {
      this.shortcuts = childComp.shortcuts;
      this.shortcut = this.shortcuts[0];
      this.contentType = 'stock';
      this.childComp.showInfo(this.shortcut);
      this.childComp.showPrices();
      this.submitRangeShortcut(true);
      this.childContentClass = 'outer-outlet child-content';
      this.navbarClass = 'navbar is-dark';
    }
    else if (url  === '/') {
      this.navbarClass = 'navbar is-dark';
      this.contentType = 'homepage';
      this.childContentClass = 'outer-outlet';
    }
    else if (url  === '/about') {
      this.navbarClass = 'navbar navbar-shadow is-dark';
      this.contentType = 'about';
      this.childContentClass = 'outer-outlet';
    }
    else if (url === '/news') {
      this.navbarClass = 'navbar is-dark';
      this.contentType = 'news';
      this.childContentClass = 'outer-outlet';
    }
    else if (url === '/crypto') {
      this.navbarClass = 'navbar is-dark';
      this.contentType = 'crypto';
      this.shortcuts = this.childComp.shortcuts;
      this.shortcut = this.shortcuts[0];
      this.childComp.getCryptoInfo(this.shortcut);
      this.submitRangeShortcut(true);
      this.childContentClass = 'outer-outlet child-content';
    }
    else if (url === '/currency') {
      this.navbarClass = 'navbar is-dark';
      this.contentType = 'currency';
      this.shortcuts = Object.keys(this.childComp.shortcuts);
      this.shortcut = this.shortcuts[0];
      this.childComp.getCurrecyInfo();
      this.submitRangeShortcut(true);
      this.childContentClass = 'outer-outlet child-content';
    }
    else if (url  === '/etf') {
      this.navbarClass = 'navbar is-dark';
      this.contentType = 'etf';
      this.shortcuts = this.childComp.shortcuts;
      this.shortcut = this.shortcuts[0];
      this.submitRangeShortcut(true);
      this.childContentClass = 'outer-outlet';
    }
    else if (url  === '/stockindex') {
      this.navbarClass = 'navbar is-dark';
      this.contentType = 'index';
      this.childComp.getCurrentPrices();
      this.shortcuts = Object.keys(this.childComp.shortcuts);
      this.shortcut = this.shortcuts[0];
      this.submitRangeShortcut(true);
      this.childContentClass = 'outer-outlet';
    }
  }

  ngOnInit() {
    this.runningBarClass.forEach((element: string, i: number) => {
      this.runningBarClass[i] = this.barClassBasicName + i;
    });
    this.getTopBarPrice(() => this.runBar());
  }

  ngAfterViewInit() {
    this.drawBigDot();
  }
}
