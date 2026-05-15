import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderRequest } from './order.models';

export interface Bike {
  id: number;
  model: string;
  imageSource: string;
  stock: number;
  details: string;
  electric: boolean;
  price: number;
}

export interface CartItem extends Bike{
  quantity: number;
}

export interface Cart {
  cartItems: CartItem[];
  cartTotal: number;
  cartIsEmpty: boolean;
}


@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly cartUrl = 'http://localhost:8082';
  private readonly orderUrl = 'http://localhost:8083';
  orderState: WritableSignal<Order[]> = signal([]);
  cartState: WritableSignal<Cart | null> = signal(null);


  constructor(private httpClient: HttpClient) {}

    finaliseOrder(value: OrderRequest): Observable<Order> {
    return this.httpClient.post<Order>(`${this.orderUrl}/order/finalise`, {...value.shippingAddress, acquireType: value.acquireType});
  }

    loadOrderHistory() {
    this.httpClient.get<Order[]>(`${this.orderUrl}/order/history`).subscribe(orders => this.orderState.set(orders));
  }

    loadCart(): Observable<Cart> {
    return this.httpClient.get<Cart>(`${this.cartUrl}/cart`);
  }
}
