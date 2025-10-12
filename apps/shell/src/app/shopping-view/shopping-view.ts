import { ChangeDetectionStrategy, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { CartComponent } from 'cart/CartComponent';
import { BikeListComponent } from 'bikes/BikeListComponent';

@Component({
  selector: 'app-shopping-view',
  imports: [],
  templateUrl: './shopping-view.html',
  styleUrls: ['./shopping-view.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingView {
  @ViewChild('vc', { read: ViewContainerRef, static: true }) vc!: ViewContainerRef;
  @ViewChild('bikes', { read: ViewContainerRef, static: true }) bikes!: ViewContainerRef;

  ngOnInit() {
      this.vc.createComponent(CartComponent);
      this.bikes.createComponent(BikeListComponent);
  }
}
