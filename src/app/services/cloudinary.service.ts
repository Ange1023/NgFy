import { Injectable } from '@angular/core';
import { HttpService } from './http-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  constructor(private httpService: HttpService) {}

  uploadImage(file: File, uploadType: string, uploadMetadata: any = {}): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', uploadType);

    for (const key in uploadMetadata) {
      formData.append(key, uploadMetadata[key]);
    }

    return this.httpService.request<any>(
      'api/upload-image', 
      'POST',
      formData
    );
  }
}