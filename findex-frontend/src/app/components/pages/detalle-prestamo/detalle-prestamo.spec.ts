import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePrestamo } from './detalle-prestamo';

describe('DetallePrestamo', () => {
  let component: DetallePrestamo;
  let fixture: ComponentFixture<DetallePrestamo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallePrestamo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallePrestamo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
