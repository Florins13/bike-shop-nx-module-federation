import { Routes } from '@angular/router';
import { LoginComponent } from './login/login-component';
import { CheckoutComponent } from './orders/checkout/checkout-component';
import { OrderHistoryComponent } from './orders/order-history/order-history-component';
import { ShoppingView } from './shopping-view/shopping-view';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'shop', component: ShoppingView },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'orders', component: OrderHistoryComponent },
];
