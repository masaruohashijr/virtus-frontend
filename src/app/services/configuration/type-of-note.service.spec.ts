import { TestBed } from '@angular/core/testing';

import { GradeTypeService } from './grade-type.service';

describe('GradeTypeService', () => {
  let service: GradeTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradeTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
