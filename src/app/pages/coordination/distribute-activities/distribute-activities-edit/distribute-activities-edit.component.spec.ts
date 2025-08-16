import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributeActivitiesEditComponent } from './distribute-activities-edit.component';
import { beforeEach, describe, it } from 'node:test';

describe('DistributeActivitiesEditComponent', () => {
  let component: DistributeActivitiesEditComponent;
  let fixture: ComponentFixture<DistributeActivitiesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributeActivitiesEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributeActivitiesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
  });
});
function expect(component: DistributeActivitiesEditComponent) {
  return {
    toBeTruthy: () => {
      if (!component) {
        throw new Error('Expected component to be truthy');
      }
    }
  };
}
