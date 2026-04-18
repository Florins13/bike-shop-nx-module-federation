import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { provideHttpClient } from '@angular/common/http';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { CheckoutComponent } from './app/orders/checkout/checkout-component';

export async function mount() {
  const app = await createApplication({
    providers: [
      provideExperimentalZonelessChangeDetection(),
      provideHttpClient(),
    ]
  });

  const element = createCustomElement(CheckoutComponent, { injector: app.injector });
  if (!customElements.get('mfe-orders')) {
    customElements.define('mfe-orders', element);
  }
}
