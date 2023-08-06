import { TestBed } from '@angular/core/testing';

import { PillarsService } from './pillars.service';

describe('PillarsService', () => {
  let service: PillarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PillarsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
