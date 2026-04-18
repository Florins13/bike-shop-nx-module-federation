import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from './cart.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly apiUrl = 'http://localhost:8080';
  cartState: WritableSignal<Cart | null> = signal(null);

  httpClient = inject(HttpClient);

  loadCart() {
    this.getCart().subscribe(cart => this.cartState.set(cart));
  }
  
  addToCart(id: number): Observable<unknown> {
    return this.httpClient.post(`${this.apiUrl}/cart/add/${id}`, {});
  }

  getCart(): Observable<Cart> {
    return this.httpClient.get<Cart>(`${this.apiUrl}/cart`);
  }

  deleteCartItem(id: number): Observable<unknown> {
    return this.httpClient.post(`${this.apiUrl}/cart/deleteItem/${id}`, {});
  }

    updateCartItemQuantity(id: number, type: 'increase' | 'decrease'): Observable<unknown> {
        return this.httpClient.post(`${this.apiUrl}/cart/updateQuantity/${id}/${type}`, {});
    }
}
