import { createApplication } from '@angular/platform-browser';
import { createComponent, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { CheckoutComponent } from './app/orders/checkout/checkout-component';

export async function mount(hostElement: HTMLElement) {
  const appRef = await createApplication({
    providers: [
      provideExperimentalZonelessChangeDetection(),
      provideHttpClient(),
    ]
  });

  const compRef = createComponent(CheckoutComponent, {
    environmentInjector: appRef.injector,
    hostElement,
  });

  appRef.attachView(compRef.hostView);

  return () => {
    compRef.destroy();
    appRef.destroy();
  };
}
