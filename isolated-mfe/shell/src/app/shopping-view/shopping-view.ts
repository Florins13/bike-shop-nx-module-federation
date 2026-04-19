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
  bikesLoaded = false;
  cartLoaded = false;
  loadError = '';

  async ngOnInit() {
    try {
      const [{ mount: mountBikes }, { mount: mountCart }] = await Promise.all([
        import('bikes/web-component'),
        import('cart/web-component'),
      ]);
      await mountBikes();
      this.bikesLoaded = true;
      await mountCart();
      this.cartLoaded = true;
    } catch (err) {
      this.loadError = `Failed to load remotes: ${err}`;
      console.error('Remote loading failed:', err);
    }
  }
}
