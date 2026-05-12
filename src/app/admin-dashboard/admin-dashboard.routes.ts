import { Routes } from '@angular/router';
import { AdminDashboard } from './layout/admin-dashboard/admin-dashboard';
import { ProductsAdmin } from './pages/products-admin/products-admin';
import { ProductAdmin } from './pages/product-admin/product-admin';
import { IsAdminGuard } from '@auth/guards/is-admin-guard';


export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboard,
    canMatch: [IsAdminGuard],
    children: [
      {
        path: 'products',
        component: ProductsAdmin,
      },
      {
        path: 'products/:id',
        component: ProductAdmin,
      },
      {
        path: '**',
        redirectTo: 'products',
      },
    ],
  },
];

export default adminDashboardRoutes;
