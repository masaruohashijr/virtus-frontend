import { TestBed } from '@angular/core/testing';

import { ProductPlanHistoryService } from './product-plan-history.service';

describe('ProductPlanHistoryService', () => {
  let service: ProductPlanHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductPlanHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
