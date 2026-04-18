import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { CheckoutComponent } from './app/orders/checkout/checkout-component';

bootstrapApplication(CheckoutComponent, appConfig).catch((err) => console.error(err));
