import { TestBed } from '@angular/core/testing';

import { EntityVirtusService } from './entity-virtus.service';

describe('EntityVirtusService', () => {
  let service: EntityVirtusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityVirtusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
