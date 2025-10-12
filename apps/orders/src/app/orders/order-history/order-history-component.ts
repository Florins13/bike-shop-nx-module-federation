import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-history',
  imports: [],
  templateUrl: './order-history-component.html',
  styleUrl: './order-history-component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistoryComponent implements OnInit {

  constructor(private orderService: OrderService) {}

  orders = this.orderService.orderState;

  ngOnInit(): void {
      this.orderService.loadOrderHistory();
  }
}
