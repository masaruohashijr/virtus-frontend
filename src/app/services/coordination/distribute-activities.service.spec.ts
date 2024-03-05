import { TestBed } from '@angular/core/testing';

import { DistributeActivitiesService } from './distribute-activities.service';

describe('DistributeActivitiesService', () => {
  let service: DistributeActivitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistributeActivitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
