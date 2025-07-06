import { TestBed } from '@angular/core/testing';

import { AutomaticScoresService } from './automatic-scores.service';

describe('AutomaticScoresService', () => {
  let service: AutomaticScoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutomaticScoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
