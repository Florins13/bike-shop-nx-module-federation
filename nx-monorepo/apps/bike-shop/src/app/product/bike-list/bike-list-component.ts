import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Bike } from '../bike';
import { BikeService } from '../bike.service';
import { CartService } from '../../cart/cart.service';


@Component({
  selector: 'app-bike-list',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './bike-list-component.html',
  styleUrl: './bike-list-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BikeListComponent implements OnInit{
  role: 'BASIC' | 'MANAGER' | 'GUEST' = 'BASIC';
  searchTerm = '';

  bikeService = inject(BikeService);
  cartService = inject(CartService);

  bikes: WritableSignal<Bike[]> = signal([]);

  ngOnInit(): void {
    this.bikeService.getBikes().subscribe(bikes => this.bikes.set(bikes));
  }

  filteredBikes(): Bike[] {
    const term = this.searchTerm.toLowerCase();
    return this.bikes().filter(b => b.model.toLowerCase().includes(term));
  }

  addToCart(bike: Bike) {
    this.cartService.addToCart(bike.id).subscribe({
      next: () => {
        this.cartService.loadCart();
      },
      error: (err) => {
        console.error('Error adding bike to cart:', err);
      }
    });
  }

  editBike(bike: Bike) {
    console.log('Edit bike:', bike);
    // TODO: navigate to bike edit form
  }

  deleteBike(bike: Bike) {
    console.log('Delete bike:', bike);
    // TODO: call backend to delete
  }
}
