import { TestBed } from '@angular/core/testing';

import { Prestamista } from './prestamista';

describe('Prestamista', () => {
  let service: Prestamista;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Prestamista);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
