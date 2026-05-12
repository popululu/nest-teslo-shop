import { Routes } from '@angular/router';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path:'login',
        component: LoginPage,
      },
      {
        path:'register',
        component: RegisterPage,
      },
      {
        path:'**',
        redirectTo:'login',
      },
    ],
  },
];
//Este routes se cargaria desde app.routes.ts component padre app/app.routes.ts y en ese si aqui pones export default no hace falta
//poner en el padre el .then en el loadChildren y hacer las rutas mas faciles
export default authRoutes;
