import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-history',
  imports: [],
  templateUrl: './order-history-component.html',
  styleUrl: './order-history-component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistoryComponent implements OnInit {
  orderService = inject(OrderService);

  orders = this.orderService.orderState;

  ngOnInit(): void {
    if(this.orderService.orderState().length === 0) {
      this.orderService.loadOrderHistory();
    }
  }
}
