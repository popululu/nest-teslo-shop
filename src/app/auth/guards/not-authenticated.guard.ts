import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticadedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  // console.log(NotAuthenticadedGuard);

  const authService = inject(AuthService);
  const router = inject(Router);

  // const isAuthenticated = authService.authStatus();


  // firstValueFrom Manda un Observable y esperar la respuesta como si fuera una promesa
  const isAuthenticated = await firstValueFrom(authService.checkStatus());


  console.log( isAuthenticated +" HOlas" );
  //Si esta autenticado no te deja ir a la pagina de auth/login
  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }

  return true;
}
