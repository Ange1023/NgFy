import { Injectable } from '@angular/core';
import { HttpService } from './http-service.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor( private http: HttpService) { }

  searchSongs(currentPage: number, limit: number, title: string, category?: string) {
    const body = { currentPage, limit, title, category };
    return this.http.request<any>(
      'songs/search',
      'POST',
      body
    );
  }
}
