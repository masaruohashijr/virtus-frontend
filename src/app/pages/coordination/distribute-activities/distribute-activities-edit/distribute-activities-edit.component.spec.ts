import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributeActivitiesEditComponent } from './distribute-activities-edit.component';

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
    expect(component).toBeTruthy();
  });
});
