import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const a = inject(AuthService);
  await a.ready;
  return a.profile() ? true : inject(Router).createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = async () => {
  const a = inject(AuthService);
  await a.ready;
  return a.profile()?.role === 'admin' ? true : inject(Router).createUrlTree(['/tabs/movies']);
};
