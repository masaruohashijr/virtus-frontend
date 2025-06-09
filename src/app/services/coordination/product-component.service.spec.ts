import { TestBed } from '@angular/core/testing';

import { ProductComponentService } from './product-component.service';

describe('ProductComponentService', () => {
  let service: ProductComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
