import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { CartComponent } from './app/cart/cart-component';

export async function mount() {
  const app = await createApplication({
    providers: [
      provideZonelessChangeDetection(),
      provideHttpClient(),
    ]
  });

  const element = createCustomElement(CartComponent, { injector: app.injector });
  if (!customElements.get('mfe-cart')) {
    customElements.define('mfe-cart', element);
  }
}
