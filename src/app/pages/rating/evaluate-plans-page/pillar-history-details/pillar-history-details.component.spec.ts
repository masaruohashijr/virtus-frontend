import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillarHistoryDetailsComponent } from './pillar-history-details.component';

describe('PillarHistoryDetailsComponent', () => {
  let component: PillarHistoryDetailsComponent;
  let fixture: ComponentFixture<PillarHistoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PillarHistoryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PillarHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
