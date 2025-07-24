import { Injectable } from '@angular/core';
import { HttpService } from './http-service.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userProfileSubject = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject.asObservable();
  
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

  updateUserProfile(data: any) {
    return this.httpService.request<any>('user/', 'PUT', data);
  }
  
  deleteUserAccount(id: string) {
    return this.httpService.request<any>(`user/${id}`, 'DELETE');
  }
}
