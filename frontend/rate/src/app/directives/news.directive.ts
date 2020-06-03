import { Directive, HostListener, ElementRef, Renderer2, OnInit, Input } from '@angular/core';
import { News } from '../models/news.model';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[rateNews]'
})
export class NewsDirective implements OnInit {

  @Input()
  article: News;
  public detailNr: number;
  private fullArticle;

  articleDetails: string;

  constructor(private element: ElementRef, private renderer: Renderer2, private sanitized: DomSanitizer) {
    this.fullArticle = this.renderer.createElement('div');
    this.renderer.addClass(this.fullArticle, 'restContent');
    this.renderer.addClass(this.fullArticle, 'columns');
  }

  @HostListener('mouseenter')
  showDetail() {
    this.articleDetails =
      '<div class="column is-4"> <div class="photoWrap"><img src=' + this.article.urlToImage + ' alt="BRAK ZDJĘCIA"> </div> </div>'
      + '<div class="column is-8 articleInfo">'
        + '<div class="date">' + this.article.publishedAt.slice(0, 10)
          + '<span class="hour"> godzina: ' + this.article.publishedAt.slice(11, 19) + '</span></div>'
        + '<div class="content">' + this.article.content + '</div>'
        + '<div class="sources columns">'
          + '<div class="column is-5">autor: <span class="authorName">' + this.article.author + '</span></div>'
          + '<div class="column is-7"><a class="link" href="'
            + this.article.url + '">Przeczytaj całość na stronie: <span class="pressName">' + this.article.source.name + '</span></a></div>'
        + '</div>'
      + '</div>';
    this.fullArticle.innerHTML = this.articleDetails;
    this.renderer.appendChild(this.element.nativeElement, this.fullArticle);
    this.renderer.addClass(this.element.nativeElement, 'bigSize');
  }

  @HostListener('mouseleave')
  closeDetail() {
    this.renderer.removeChild(this.element.nativeElement, this.fullArticle);
    this.renderer.removeClass(this.element.nativeElement, 'bigSize');
  }

  ngOnInit(): void {
  }
}
