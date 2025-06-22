import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorScoresComponent } from './indicator-scores.component';

describe('IndicatorScoresComponent', () => {
  let component: IndicatorScoresComponent;
  let fixture: ComponentFixture<IndicatorScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorScoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatorScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
