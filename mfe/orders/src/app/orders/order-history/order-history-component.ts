import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-history',
  imports: [],
  templateUrl: './order-history-component.html',
  styleUrl: './order-history-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);
  orders = this.orderService.orderState;

  ngOnInit(): void {
    this.orderService.loadOrderHistory();
  }
}
