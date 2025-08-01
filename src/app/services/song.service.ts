import { Injectable } from '@angular/core';
import { HttpService } from './http-service.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor(private http: HttpService) { }

  getPaginateSongs(currentPage: number, limit: number) {
    const body = { currentPage, limit };
    return this.http.request<any>(
      'songs/paginate',
      'POST',
      body
    );
  }

  getUserPaginateSongs(currentPage: number, limit: number, artist: string) {
    const body = { currentPage, limit , artist:artist };
    return this.http.request<any>(
      'songs/paginate',
      'POST',
      body
    );
  }

  getSongById(id: string) {
    return this.http.request<any>(
      `songs/${id}`,
      'GET'
    );
  }

  getCategoriesSong(){
    return this.http.request<any>(
      'songs/categories',
      'GET'
    );
  }

  createSong(formData: FormData) {
    return this.http.request<any>('songs', 'POST', formData);
  }

  editSong(id: string,  name: string) {
    return this.http.request<any>(`songs/${id}`, 'PUT',  { title: name });
  }

  deleteSong(id: string) {
    return this.http.request<any>(`songs/${id}`, 'DELETE');
  }
}
