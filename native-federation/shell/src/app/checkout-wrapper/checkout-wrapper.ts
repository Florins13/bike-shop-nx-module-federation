import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'app-checkout-wrapper',
  template: `
    @if (loadError) {
      <div style="color: red; padding: 20px; text-align: center;">
        <p>{{ loadError }}</p>
      </div>
    } @else {
      <mfe-orders></mfe-orders>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckoutWrapper implements OnInit {
  loadError = '';

  async ngOnInit() {
    try {
      // Native Federation: use loadRemoteModule() instead of dynamic import()
      const { mount } = await loadRemoteModule({
        remoteName: 'orders',
        exposedModule: './web-component'
      });
      await mount();
    } catch (err) {
      this.loadError = `Failed to load orders remote: ${err}`;
      console.error('Orders remote loading failed:', err);
    }
  }
}
