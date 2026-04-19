import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout-wrapper',
  template: '<mfe-orders></mfe-orders>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckoutWrapper implements OnInit {
  loadError = '';

  async ngOnInit() {
    try {
      const { mount } = await import('orders/web-component');
      await mount();
    } catch (err) {
      this.loadError = `Failed to load orders remote: ${err}`;
      console.error('Orders remote loading failed:', err);
    }
  }
}
