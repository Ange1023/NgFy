import { Injectable } from '@angular/core';
import { HttpService } from './http-service.service';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';


export interface UserCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly AUTH_TOKEN_KEY = 'auth_token';

  constructor(private http: HttpService) {}

  signIn(credentials: UserCredentials): Observable<any> {
    return this.http.request<any>(
      'auth/signin',
      'POST',
      credentials
    ).pipe(
      tap(response => this.storeAuthData(response.data))
    );
  }

  signUp(userData: any): Observable<any> {
    return this.http.request<any>(
      'auth/signup',
      'POST',
      userData
    );
  }

  private async storeAuthData(authData: any): Promise<void> {
    try {
      await SecureStoragePlugin.set({
        key: this.AUTH_TOKEN_KEY,
        value: authData.token
      });
      

    } catch (error) {
      console.error('Error al guardar datos de autenticación:', error);
      throw error;
    }
  }

  getToken(): Observable<string | null> {
    return from(SecureStoragePlugin.get({ key: this.AUTH_TOKEN_KEY })).pipe(
      switchMap(result => of(result.value)),
      catchError(error => {
        console.error('Error al obtener token:', error);
        return of(null);
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.getToken().pipe(
      switchMap(token => of(!!token)),
      tap(isAuth => console.log('Is authenticated:', isAuth)),
      catchError(error => {
        console.error('Error al verificar autenticación:', error);
        return of(false);
      })
    );
  }

  async signOut(): Promise<void> {
    try {
      await SecureStoragePlugin.remove({ key: this.AUTH_TOKEN_KEY });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

}