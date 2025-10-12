import { Route } from '@angular/router';
import { ShoppingView } from './shopping-view/shopping-view';

// import { CheckoutComponent } from "shop/ShopHistory";


export const appRoutes: Route[] = [
  {
    path: '',
    component: ShoppingView,
  },
  {
    path: 'checkout',
    loadChildren: () => import('orders/Orders').then((m) => m.remoteRoutes),
  }
];
