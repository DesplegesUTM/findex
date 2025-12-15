import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPrestamo } from './crear-prestamo';

describe('CrearPrestamo', () => {
  let component: CrearPrestamo;
  let fixture: ComponentFixture<CrearPrestamo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearPrestamo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearPrestamo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
