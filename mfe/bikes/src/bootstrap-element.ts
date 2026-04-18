import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BikeListComponent } from './app/product/bike-list/bike-list-component';

export async function mount() {
  const app = await createApplication({
    providers: [
      provideZonelessChangeDetection(),
      provideHttpClient(),
      provideAnimationsAsync(),
    ]
  });

  const element = createCustomElement(BikeListComponent, { injector: app.injector });
  if (!customElements.get('mfe-bikes')) {
    customElements.define('mfe-bikes', element);
  }
}
