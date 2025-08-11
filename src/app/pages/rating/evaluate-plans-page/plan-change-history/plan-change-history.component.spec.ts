import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanChangeHistoryComponent } from './plan-change-history.component';

describe('PlanChangeHistoryComponent', () => {
  let component: PlanChangeHistoryComponent;
  let fixture: ComponentFixture<PlanChangeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanChangeHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanChangeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
