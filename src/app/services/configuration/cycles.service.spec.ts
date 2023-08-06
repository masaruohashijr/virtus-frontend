import { TestBed } from '@angular/core/testing';

import { CyclesService } from './cycles.service';

describe('CiclesService', () => {
  let service: CyclesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyclesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
