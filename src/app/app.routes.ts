import { Routes } from '@angular/router';
import { NotAuthenticadedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    // TODO Guards
    // cada vez que se navega a cualquier ruta necesito verificarlo
    //arreglo de todas las rutas
    canMatch: [
      NotAuthenticadedGuard,
      // () => {
      //   console.log('Hola Mundo');
      //   // no pasa
      //   // return false
      // }

    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),
  },
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes'),
  },
];
