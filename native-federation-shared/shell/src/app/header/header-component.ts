import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header-component.html',
  standalone: true,
})
export class HeaderComponent {
  @Input() role: 'BASIC' | 'MANAGER' | 'GUEST' = 'GUEST';

  constructor(private router: Router) {}

  goToBikes() { this.router.navigate(['/']); }
  goToOrders() { this.router.navigate(['/checkout']); }
  goToCart() { this.router.navigate(['/']); }
  logIn() { console.log('Log in'); }
  logOut() { console.log('Log out'); }
}
