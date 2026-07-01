import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Get the AuthService instance using Angular's inject function
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // Clone the request and add the Authorization header if the token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Send the request and handle any errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If the backend responds with "401 Unauthorized" (Token expired or missing)
      if (error.status === 401) {
        console.warn('Access Token expired or invalid!');
        // TODO: Here we will add the logic to call the Refresh Token
        // For now, we log out the user brutally
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};