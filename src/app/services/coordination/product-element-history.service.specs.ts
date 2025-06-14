import { TestBed } from '@angular/core/testing';

import { ProductComponentHistoryService } from './product-component-history.service';

describe('ProductComponentHistoryService', () => {
  let service: ProductComponentHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductComponentHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
