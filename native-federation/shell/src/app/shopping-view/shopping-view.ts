import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'app-shopping-view',
  imports: [],
  templateUrl: './shopping-view.html',
  styleUrls: ['./shopping-view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShoppingView implements OnInit {
  bikesLoaded = false;
  cartLoaded = false;
  loadError = '';

  async ngOnInit() {
    try {
      // Native Federation: use loadRemoteModule() instead of dynamic import()
      const [bikesModule, cartModule] = await Promise.all([
        loadRemoteModule({
          remoteName: 'bikes',
          exposedModule: './web-component'
        }),
        loadRemoteModule({
          remoteName: 'cart',
          exposedModule: './web-component'
        }),
      ]);

      await bikesModule.mount();
      this.bikesLoaded = true;
      await cartModule.mount();
      this.cartLoaded = true;
    } catch (err) {
      this.loadError = `Failed to load remotes: ${err}`;
      console.error('Remote loading failed:', err);
    }
  }
}
