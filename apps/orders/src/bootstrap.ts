import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { OrderHistoryComponent } from './app/orders/order-history/order-history-component';

bootstrapApplication(OrderHistoryComponent, appConfig).catch((err) => console.error(err));
