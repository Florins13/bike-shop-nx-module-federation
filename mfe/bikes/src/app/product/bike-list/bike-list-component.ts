import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Bike } from '../bike';
import { BikeService } from '../bike.service';

@Component({
  selector: 'app-bike-list',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './bike-list-component.html',
  styleUrl: './bike-list-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BikeListComponent implements OnInit, OnDestroy {
  role: 'BASIC' | 'MANAGER' | 'GUEST' = 'BASIC';
  searchTerm: string = '';

  constructor(private bikeService: BikeService) {}

  ngOnDestroy(): void {
    console.log('BikeListComponent destroyed');
  }

  bikes: WritableSignal<Bike[]> = signal([]);

  ngOnInit(): void {
    this.bikeService.getBikes().subscribe(bikes => this.bikes.set(bikes));
  }

  filteredBikes(): Bike[] {
    const term = this.searchTerm.toLowerCase();
    return this.bikes().filter(b => b.model.toLowerCase().includes(term));
  }

  addToCart(bike: Bike) {
    window.dispatchEvent(new CustomEvent('add-to-cart', { detail: bike.id, bubbles: true, composed: true }));
    console.log(`Dispatched add-to-cart event for bike id: ${bike.id}`);
  }

  editBike(bike: Bike) {
    console.log('Edit bike:', bike);
  }

  deleteBike(bike: Bike) {
    console.log('Delete bike:', bike);
  }
}
