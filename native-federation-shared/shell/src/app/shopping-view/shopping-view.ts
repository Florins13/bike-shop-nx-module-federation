import { ChangeDetectionStrategy, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'app-shopping-view',
  imports: [],
  templateUrl: './shopping-view.html',
  styleUrls: ['./shopping-view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingView implements OnInit {
  @ViewChild('bikesHost', { static: true }) bikesHost!: ElementRef<HTMLElement>;
  @ViewChild('cartHost', { static: true }) cartHost!: ElementRef<HTMLElement>;

  loadError = signal('');

  async ngOnInit() {
    try {
      const [bikesModule, cartModule] = await Promise.all([
        loadRemoteModule({
          remoteName: 'bikes',
          exposedModule: './mount'
        }),
        loadRemoteModule({
          remoteName: 'cart',
          exposedModule: './mount'
        }),
      ]);

      await bikesModule.mount(this.bikesHost.nativeElement);
      await cartModule.mount(this.cartHost.nativeElement);
    } catch (err) {
      this.loadError.set(`Failed to load remotes: ${err}`);
      console.error('Remote loading failed:', err);
    }
  }
}
