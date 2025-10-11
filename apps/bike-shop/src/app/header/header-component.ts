import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss'
})
export class HeaderComponent {
  @Input() role: 'BASIC' | 'MANAGER' | 'GUEST' = 'GUEST';

  goToBikes() { console.log('Navigate to Bikes'); }
  goToOrders() { console.log('Navigate to Orders'); }
  goToCart() { console.log('Navigate to Cart'); }
  logIn() { console.log('Log in'); }
  logOut() { console.log('Log out'); }
}
