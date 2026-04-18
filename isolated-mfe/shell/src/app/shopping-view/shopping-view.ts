import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-view',
  imports: [],
  templateUrl: './shopping-view.html',
  styleUrls: ['./shopping-view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShoppingView implements OnInit {
  async ngOnInit() {
    const [{ mount: mountBikes }, { mount: mountCart }] = await Promise.all([
      import('bikes/web-component'),
      import('cart/web-component'),
    ]);
    await Promise.all([mountBikes(), mountCart()]);
  }
}
