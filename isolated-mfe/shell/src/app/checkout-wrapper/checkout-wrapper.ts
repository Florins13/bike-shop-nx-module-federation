import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout-wrapper',
  template: '<isolated-mfe-orders></isolated-mfe-orders>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckoutWrapper implements OnInit {
  async ngOnInit() {
    const { mount } = await import('orders/web-component');
    await mount();
  }
}
