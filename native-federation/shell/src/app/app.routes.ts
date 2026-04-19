import { Route } from '@angular/router';
import { ShoppingView } from './shopping-view/shopping-view';
import { CheckoutWrapper } from './checkout-wrapper/checkout-wrapper';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShoppingView,
  },
  {
    path: 'checkout',
    component: CheckoutWrapper,
  }
];
