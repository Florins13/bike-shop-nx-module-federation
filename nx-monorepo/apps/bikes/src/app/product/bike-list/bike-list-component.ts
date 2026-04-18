import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, OnDestroy, OnInit, output, Output, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Bike } from '../bike';
import { BikeService } from '../bike.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';


@Component({
  selector: 'app-bike-list',
  imports: [ReactiveFormsModule, FormsModule, ButtonModule, CardModule, TagModule, InputTextModule, BadgeModule],
  templateUrl: './bike-list-component.html',
  styleUrl: './bike-list-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BikeListComponent implements OnInit, OnDestroy{
  role: 'BASIC' | 'MANAGER' | 'GUEST' = 'BASIC';
  searchTerm: string = '';

  // ...existing code...

  // bikeService = inject(BikeService);
  // cartService = inject(CartService);
  constructor(private bikeService: BikeService) {}
  ngOnDestroy(): void {
    console.log('BikeListComponent destroyed');
    window.removeEventListener('add-to-cart', () => {});
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
    // TODO: navigate to bike edit form
  }

  deleteBike(bike: Bike) {
    console.log('Delete bike:', bike);
    // TODO: call backend to delete
  }
}
