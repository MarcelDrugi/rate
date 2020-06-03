import { Component, OnInit } from '@angular/core';
import { InfoApiService } from 'src/app/services/info-api.service';
import { News } from 'src/app/models/news.model';

@Component({
  selector: 'rate-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.less']
})
export class HomepageComponent implements OnInit {

  private imgNumbers = 4;
  private basicClassName = 'slideHome';
  public imgClass = Array<string>(this.imgNumbers).fill(this.basicClassName);
  private currentIndex = 0;
  public radioIndex = 0;
  public news: Array<News>;
  private error: string;

  constructor(private api: InfoApiService) { }

  changeImg(sign: boolean){
    if (sign === true){
      if (this.currentIndex < this.imgNumbers - 1){
        this.imgClass[this.currentIndex] = this.basicClassName + ' outLeft';
        this.currentIndex += 1;
        this.imgClass[this.currentIndex] = this.basicClassName + ' in';
        if (this.currentIndex < this.radioIndex) {
          return this.changeImg(true);
        }
        else {
          this.radioIndex = this.currentIndex;
        }
      }
    }
    if (sign === false){
      if (this.currentIndex > 0){
        this.imgClass[this.currentIndex] = this.basicClassName + ' outRight';
        this.currentIndex -= 1;
        this.imgClass[this.currentIndex] += ' in';
        if (this.currentIndex > this.radioIndex) {
          return this.changeImg(false);
        }
        else {
          this.radioIndex = this.currentIndex;
        }
      }
    }
  }

  radioChangeImg(event: number): void {
    this.radioIndex = event;
    if (this.currentIndex < event) {
      this.changeImg(true);
    }
    else if (this.currentIndex > event) {
      this.changeImg(false);
    }
  }

  getNews() {
    let newsIter = 0;
    this.news = [];
    this.api.getNews().subscribe(
      (news: any) => {
        for (const element of news['articles']) {
          if (newsIter < 3) {
            if (element.author) {
              this.news.push(element);
              newsIter++;
            }
          }
          else {
            break;
          }
        }
      },
      error => this.error = error.status
    );
  }

  ngOnInit(): void {
    this.imgClass.forEach((element: string, i: number) => {
      if (i === 0) {
        this.imgClass[i] = this.basicClassName + ' in';
      }
      else {
        this.imgClass[i] = this.basicClassName;
      }
    });
    this.getNews();
  }

}
