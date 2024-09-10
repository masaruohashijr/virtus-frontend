import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryViewReasonComponent } from './history-view-reason.component';

describe('HistoryViewReasonComponent', () => {
  let component: HistoryViewReasonComponent;
  let fixture: ComponentFixture<HistoryViewReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryViewReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryViewReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
