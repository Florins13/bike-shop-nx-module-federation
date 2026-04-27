import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./orders/checkout/checkout-component').then((c) => c.CheckoutComponent),
  }
];
