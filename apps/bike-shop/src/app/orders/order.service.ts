import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderRequest } from './order.models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly apiUrl = 'http://localhost:8080';
  orderState: WritableSignal<Order[]> = signal([]);

  httpClient = inject(HttpClient);

    finaliseOrder(value: OrderRequest): Observable<Order> {
    return this.httpClient.post<Order>(`${this.apiUrl}/order/finalise`, {...value.shippingAddress, acquireType: value.acquireType});
  }

    loadOrderHistory() {
    this.httpClient.get<Order[]>(`${this.apiUrl}/order/history`).subscribe(orders => this.orderState.set(orders));
  }
}
