import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { BikeListComponent } from './app/product/bike-list/bike-list-component';

bootstrapApplication(BikeListComponent, appConfig).catch((err) => console.error(err));
