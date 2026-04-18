import { Route } from '@angular/router';
import { BikeListComponent } from './product/bike-list/bike-list-component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: BikeListComponent
  },
];
