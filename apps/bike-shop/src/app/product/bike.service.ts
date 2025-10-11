import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bike } from './bike';

@Injectable({ providedIn: 'root' })
export class BikeService {
  private apiUrl = 'http://localhost:8080/bikes';

  http = inject(HttpClient);

  getBikes(): Observable<Bike[]> {
    return this.http.get<Bike[]>(this.apiUrl);
  }
}
