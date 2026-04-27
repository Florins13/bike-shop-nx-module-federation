import { ChangeDetectionStrategy, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'app-checkout-wrapper',
  template: `
    @if (loadError()) {
      <div style="color: red; padding: 20px; text-align: center;">
        <p>{{ loadError() }}</p>
      </div>
    }
    <div #ordersHost></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutWrapper implements OnInit {
  @ViewChild('ordersHost', { static: true }) ordersHost!: ElementRef<HTMLElement>;

  loadError = signal('');

  async ngOnInit() {
    try {
      const module = await loadRemoteModule({
        remoteName: 'orders',
        exposedModule: './mount'
      });
      await module.mount(this.ordersHost.nativeElement);
    } catch (err) {
      this.loadError.set(`Failed to load orders remote: ${err}`);
      console.error('Orders remote loading failed:', err);
    }
  }
}
