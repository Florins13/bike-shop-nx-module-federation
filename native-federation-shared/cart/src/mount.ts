import { createApplication } from '@angular/platform-browser';
import { createComponent, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CartComponent } from './app/cart/cart-component';

export async function mount(hostElement: HTMLElement) {
  const appRef = await createApplication({
    providers: [
      provideZonelessChangeDetection(),
      provideHttpClient(),
      provideAnimationsAsync(),
    ]
  });

  const compRef = createComponent(CartComponent, {
    environmentInjector: appRef.injector,
    hostElement,
  });

  appRef.attachView(compRef.hostView);

  return () => {
    compRef.destroy();
    appRef.destroy();
  };
}
