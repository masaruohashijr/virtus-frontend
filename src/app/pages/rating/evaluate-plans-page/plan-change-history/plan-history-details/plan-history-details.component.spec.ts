import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanHistoryDetailsComponent } from './plan-history-details.component';

describe('PlanHistoryDetailsComponent', () => {
  let component: PlanHistoryDetailsComponent;
  let fixture: ComponentFixture<PlanHistoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanHistoryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
