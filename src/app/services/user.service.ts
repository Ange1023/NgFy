import { Injectable } from '@angular/core';
import { HttpService } from './http-service.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userProfileSubject = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject.asObservable();
  userPlaylistChanged$ = new Subject<void>();
  
  constructor(private httpService: HttpService) { }

  getUserProfile() {
    return this.httpService.request<any>('user/', 'GET');
  }

  fetchAndStoreUserProfile() {
    this.getUserProfile().subscribe({
      next: (response) => {
        this.userProfileSubject.next(response.data);
      }
    });
  }

  getUserSongs() {
  return this.httpService.request<any>('user/profile', 'GET').pipe(
      map(response => response.data.user.created_songs)
    );
  }

  getUserFavoriteSongs() {
  return this.httpService.request<any>('user/profile', 'GET').pipe(
      map(response => response.data.user.favorite_songs)
    );
  }

  getUserPlaylists(){
    return this.httpService.request<any>('user/profile', 'GET').pipe(
      map(response => ({
        my_songs: response.data.user.created_songs.length,
        favorites: response.data.user.favorite_songs.length,
      }))
    );
  }

  toggleFavoriteSong(songId: string) {
    return this.httpService.request<any>(`user/toggleFavorite/${songId}`, 'GET')
    .pipe(
      map(response => {
        this.userPlaylistChanged$.next();
        return response.data;
      })
    )
  }

  updateUserProfile(data: any) {
    return this.httpService.request<any>('user/', 'PUT', data).
    pipe(
      map(response => {
        this.userProfileSubject.next(response.data);
        return response.data;
      })  
    )
  }

  changePassword(current_password: string, new_password: string) {
    return this.httpService.request<any>('user/profile', 'PUT', { current_password, new_password }).
    pipe(
      map(response => {
        return response.data;
      })
    );
  }

  deleteUserAccount() {
    return this.httpService.request<any>(`user`, 'DELETE');
  }
}
