import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header-component";
import { FooterComponent } from './footer/footer-component';
import { StateService } from '@bike-shop-nx-module-federation/demo-lib';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('bike-angular');
  someState = inject(StateService);
}
