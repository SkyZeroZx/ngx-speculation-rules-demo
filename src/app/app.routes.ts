import { productResolver } from '@/core/resolvers';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Shop Web',
    loadComponent: () =>
      import('@/layout/content/desktop/content-desktop.component'),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@/pages/shop/web/shop-web/shop-web.component'),
      },
      {
        path: 'redirect',
        redirectTo: 'about',
      },
      {
        path: 'redirectDynamic',
        redirectTo: () => 'company',
      },
      {
        path: 'about',
        title: 'About Speculation Rules',
        loadComponent: () => import('@/pages/about/about.component'),
      },
      {
        path: 'company',
        title: 'Our Company',
        loadComponent: () => import('@/pages/company/company.component'),
      },
      {
        path: ':category',
        loadComponent: () =>
          import('@/pages/shop/web/shop-web/shop-web.component'),
      },
      {
        path: 'product/:id',
        resolve: {
          product: productResolver,
        },
        loadComponent: () =>
          import(
            '@/pages/product-detail/web/product-detail-web/product-detail-web.component'
          ),
      },
    ],
  },
];
