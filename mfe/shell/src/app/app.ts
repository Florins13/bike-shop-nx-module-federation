import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header-component';
import { FooterComponent } from './footer/footer-component';

@Component({
  imports: [RouterModule, HeaderComponent, FooterComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  protected title = 'host';

  private navigationHandler = (event: Event) => {
    const customEvent = event as CustomEvent;
    this.router.navigate([customEvent.detail]);
  };

  constructor(private router: Router) {}

  ngOnInit() {
    window.addEventListener('navigate-to', this.navigationHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('navigate-to', this.navigationHandler);
  }
}
