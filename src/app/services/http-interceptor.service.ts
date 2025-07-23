import { HttpInterceptorFn } from '@angular/common/http';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return from(SecureStoragePlugin.get({ key: 'auth_token' })).pipe(
    switchMap(result => {
      const token = result.value;
      if (token) {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Intercepted request with token:', cloned);
        
        return next(cloned);
      }
      return next(req);
    }),
    catchError(() => next(req))
  );
};