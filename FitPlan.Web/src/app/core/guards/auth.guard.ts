import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = authService.isAuthenticated();
  console.log('AuthGuard sta controllando... L\'utente è autenticato?', isAuth);
  console.log('Token presente nel localStorage:', localStorage.getItem('accessToken'));

  if (isAuth) {
    return true;
  }

  return router.createUrlTree(['/auth']);
};