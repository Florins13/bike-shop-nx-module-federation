import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemoLib } from './demo-lib';

describe('DemoLib', () => {
  let component: DemoLib;
  let fixture: ComponentFixture<DemoLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoLib],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoLib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
