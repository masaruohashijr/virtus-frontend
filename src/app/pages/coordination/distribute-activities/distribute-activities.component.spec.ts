import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributeActivitiesComponent } from './distribute-activities.component';

describe('DistributeActivitiesComponent', () => {
  let component: DistributeActivitiesComponent;
  let fixture: ComponentFixture<DistributeActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributeActivitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributeActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
