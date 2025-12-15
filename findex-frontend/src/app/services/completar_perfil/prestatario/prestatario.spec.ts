import { TestBed } from '@angular/core/testing';

import { Prestatario } from './prestatario';

describe('Prestatario', () => {
  let service: Prestatario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Prestatario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
