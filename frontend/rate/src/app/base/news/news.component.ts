import { Component, OnInit } from '@angular/core';
import { InfoApiService } from 'src/app/services/info-api.service';
import { News } from 'src/app/models/news.model';


@Component({
  selector: 'rate-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less']
})
export class NewsComponent implements OnInit {

  private error: string;
  public news: Array<News>;

  constructor(private api: InfoApiService) { }

  getNews(): void {
    this.api.getNews().subscribe(
      (news: any) => {
        this.news = news['articles'];
      },
      error => this.error = error.status
    );
  }

  ngOnInit(): void {
    this.getNews();
  }

}
