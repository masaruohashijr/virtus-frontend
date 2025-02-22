import { TestBed } from '@angular/core/testing';

import { EvaluatePlansService } from './evaluate-plans.service';

describe('EvaluatePlansService', () => {
  let service: EvaluatePlansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluatePlansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
