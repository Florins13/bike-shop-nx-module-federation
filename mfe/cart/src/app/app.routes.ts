import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./cart/cart-component').then((c) => c.CartComponent),
  }
];
