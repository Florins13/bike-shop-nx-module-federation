import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BikeListComponent } from "../product/bike-list/bike-list-component";
import { CartComponent } from "../cart/cart-component";

@Component({
  selector: 'app-shopping-view',
  imports: [BikeListComponent, CartComponent],
  templateUrl: './shopping-view.html',
  styleUrls: ['./shopping-view.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingView {

}
