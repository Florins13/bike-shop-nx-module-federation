import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingView } from './shopping-view';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ShoppingView', () => {
  let component: ShoppingView;
  let fixture: ComponentFixture<ShoppingView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingView],
      providers: [provideZonelessChangeDetection(), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
