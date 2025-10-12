import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bike } from './bike';

@Injectable({ providedIn: 'root' })
export class BikeService {
  private apiUrl = 'http://localhost:8080/bikes';

  constructor(private http: HttpClient) {}

  getBikes(): Observable<Bike[]> {
    return this.http.get<Bike[]>(this.apiUrl);
  }
}
