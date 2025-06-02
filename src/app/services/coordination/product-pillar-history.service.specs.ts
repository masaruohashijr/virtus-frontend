import { TestBed } from '@angular/core/testing';

import { ProductPillarHistoryService } from './product-pillar-history.service';

describe('ProductPillarHistoryService', () => {
  let service: ProductPillarHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductPillarHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
