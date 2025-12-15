import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPago } from './registrar-pago';

describe('RegistrarPago', () => {
  let component: RegistrarPago;
  let fixture: ComponentFixture<RegistrarPago>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarPago]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarPago);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
