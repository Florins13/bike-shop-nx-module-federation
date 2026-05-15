import { inject, Injectable, OnInit, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart, Bike } from './cart.models';


@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly apiUrl = 'http://localhost:8082';
  cartState: WritableSignal<Cart | null> = signal(null);
  httpClient = inject(HttpClient);

  loadCart() {
    this.getCart().subscribe(cart => this.cartState.set(cart));
  }

  addToCart(userId: string, bike: Bike): Observable<unknown> {
    console.log("CART", bike)
    return this.httpClient.post(`${this.apiUrl}/cart/add`, bike);
  }

  getCart(): Observable<Cart> {
    return this.httpClient.get<Cart>(`${this.apiUrl}/cart`);
  }

  deleteCartItem(id: number): Observable<unknown> {
    return this.httpClient.post(`${this.apiUrl}/cart/delete/${id}`, {});
  }

  updateCartItemQuantity(id: number, type: 'increase' | 'decrease'): Observable<unknown> {
    return this.httpClient.post(`${this.apiUrl}/cart/updateQuantity/${id}/${type}`, {});
  }
}
