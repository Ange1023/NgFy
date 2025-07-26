import { Injectable } from '@angular/core';
import { HttpService } from './http-service.service';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  playlistChanged$ = new Subject<void>();

  constructor(private http: HttpService) { }

  getAllPlaylists() {
    return this.http.request<any>(
      'playlists', 
      'GET'
    );
  }

  getPlaylistSongs(playlistId: string) {
    return this.http.request<any>(
      `playlists/${playlistId}`, 
      'GET'
    ).pipe(
      map(response => response.data.songs)
    );
  }

  createPlaylist(name: string) {

    return this.http.request<any>(
      'playlists', 
      'POST', 
      { name }
    ).pipe(
      map(response => {
        this.playlistChanged$.next();
        return response.data;
      })
    );
  }

  deletePlaylist(playlistId: string) {
    return this.http.request<any>(
      `playlists/${playlistId}`, 
      'DELETE'
    ).pipe(
      map(response => {
        this.playlistChanged$.next();
        return response.data;
      })
    );
  }

  updatePlaylist(playlistId: string, name: string) {
    return this.http.request<any>(
      `playlists/${playlistId}`, 
      'PATCH', 
      { name }
    ).pipe(
      map(response => {
        this.playlistChanged$.next();
        return response.data;
      })
    );
  } 

}


