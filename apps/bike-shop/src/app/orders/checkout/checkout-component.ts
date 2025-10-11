import { ChangeDetectionStrategy, Component, computed, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../order.service';
import { CartService } from '../../cart/cart.service';
import { OrderHistoryComponent } from "../order-history/order-history-component";
import { OrderRequest } from '../order.models';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, OrderHistoryComponent],
  templateUrl: './checkout-component.html',
  styleUrl: './checkout-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent implements OnInit {
  cartItems = computed(() => this.cartService.cartState()?.cartItems);

  cartTotal = computed(() =>
    this.cartItems()?.reduce((sum, item) => sum + item.bike.price * item.quantity, 0)
  );

  rentTotal = computed(() =>
    this.cartItems()?.reduce((sum, item) => sum + (item.bike.price * item.quantity * 0.3), 0)
  );

  acquireMode: 'buy' | 'rent' = 'buy';

  checkoutForm: FormGroup;

  constructor(private fb: FormBuilder, private orderService: OrderService, private cartService: CartService) {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      zipCode: ['', Validators.required],
      acquire: [this.acquireMode]
    });

  }
  ngOnInit(): void {
    if (!this.cartService.cartState()) {
      this.cartService.loadCart();
    }
  }

  finaliseOrder() {
    if (this.checkoutForm.valid) {
      const orderRequest: OrderRequest = {
        shippingAddress: this.checkoutForm.value,
        acquireType: this.acquireMode
      };
      this.orderService.finaliseOrder(orderRequest).subscribe({
        next: () => {
          this.orderService.loadOrderHistory();
          this.cartService.loadCart();
          this.checkoutForm.reset();
        },
        error: (error) => {
          console.error('Error finalising order:', error);
        }
      });
    }
  }
}

