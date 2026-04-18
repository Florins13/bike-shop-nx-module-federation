import { Route } from '@angular/router';
import { CheckoutComponent } from './orders/checkout/checkout-component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: CheckoutComponent,
  },
];
