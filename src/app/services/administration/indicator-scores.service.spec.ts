import { TestBed } from '@angular/core/testing';

import { IndicatorScoresService } from './indicator-scores.service';

describe('IndicatorScoresService', () => {
  let service: IndicatorScoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndicatorScoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
