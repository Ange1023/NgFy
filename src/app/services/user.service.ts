import { Injectable } from '@angular/core';
import { HttpService } from './http-service.service';
import { BehaviorSubject } from 'rxjs';

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
        console.log('User profile fetched and stored:', response.data);
        
      }
    });
  }

  updateUserProfile(data: any) {
    return this.httpService.request<any>('user/', 'PUT', data);
  }
  
  deleteUserAccount(id: string) {
    return this.httpService.request<any>(`user/${id}`, 'DELETE');
  }
}
