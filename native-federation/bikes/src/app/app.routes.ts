import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./product/bike-list/bike-list-component').then((c) => c.BikeListComponent),
  }
];
