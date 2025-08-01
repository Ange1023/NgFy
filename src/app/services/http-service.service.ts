import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  headers?: HttpHeaders;
  params?: any;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  request<T>(
    endpoint: string,
    method: HttpMethod,
    data?: any,
    options?: RequestOptions
  ): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const headers = options?.headers || new HttpHeaders();

    let request$: Observable<T>;

    switch (method) {
      case 'GET':
        request$ = this.http.get<T>(url, { headers });
        break;
      case 'POST':
        request$ = this.http.post<T>(url, data, { headers });
        break;
      case 'PUT':
        request$ = this.http.put<T>(url, data, { headers });
        break;
      case 'DELETE':
        request$ = this.http.delete<T>(url, { headers });
        break;
      case 'PATCH':
        request$ = this.http.patch<T>(url, data, { headers });
        break;
      default:
        return throwError(() => new Error(`Error de método: ${method}`));
    }

    return request$.pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en la petición HTTP:', error.error);
    return throwError(() => new Error(error.error.message));
  }
}