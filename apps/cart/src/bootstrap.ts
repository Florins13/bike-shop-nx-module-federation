import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { CartComponent } from './app/cart/cart-component';

bootstrapApplication(CartComponent, appConfig).catch((err) => console.error(err));
