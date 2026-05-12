import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const IsAdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);

  // firstValueFrom convierte un Observable en una Promesa
  // checkStatus():Observable<boolean>{ es un Observable
  // de esta forma no tienes que subscribirte por ser una promesa
  await firstValueFrom(authService.checkStatus());

  //Comprueva si tiene el rol de admin o no
  return authService.isAdmin();
};
