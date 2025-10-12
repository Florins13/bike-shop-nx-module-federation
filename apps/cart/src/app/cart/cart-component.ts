import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart-component.html',
  styleUrl: './cart-component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnInit, OnDestroy {

  cartItems = computed(() => this.cartService.cartState());


  constructor(private cartService: CartService, private router: Router, private host: ElementRef<HTMLElement>) {}
  ngOnDestroy(): void {
    console.log('CartComponent destroyed');
    window.removeEventListener('add-to-cart', this.handleAddToCartEvent);
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cartService.cartState.set(cart);
    });

    window.addEventListener('add-to-cart', this.handleAddToCartEvent);
  }

  handleAddToCartEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      const bikeId = customEvent.detail;
      console.log('Received bikeId from event:', bikeId);
      this.cartService.addToCart(bikeId).subscribe({
        next: () => {
          this.cartService.loadCart();
        },
        error: (err) => {
          console.error('Error adding bike to cart:', err);
        }
      });
    }

  cartTotal = computed(() =>
    this.cartItems()?.cartItems.reduce((sum, item) => sum + item.bike.price * item.quantity, 0).toFixed(2)
  );

  cartIsEmpty = computed(() => this.cartItems()?.cartItems.length === 0);

  removeItem(id: number) {
    this.cartService.deleteCartItem(id).subscribe({
      next: () => {
        this.cartService.loadCart();
      },
      error: (err) => {
        console.error('Error removing item from cart:', err);
      }
    });
  }

  updateQuantity(id: number, type: 'increase' | 'decrease') {
    this.cartService.updateCartItemQuantity(id, type).subscribe({
      next: () => {
        this.cartService.getCart().subscribe(cart => {
          this.cartService.cartState.set(cart);
        });
      },
      error: (err) => {
        console.error(`Error updating item quantity (${type}):`, err);
      }
    });
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
