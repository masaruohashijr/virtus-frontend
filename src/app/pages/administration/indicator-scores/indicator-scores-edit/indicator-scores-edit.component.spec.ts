import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorScoresEditComponent } from './indicator-scores-edit.component';

describe('IndicatorScoresEditComponent', () => {
  let component: IndicatorScoresEditComponent;
  let fixture: ComponentFixture<IndicatorScoresEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorScoresEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatorScoresEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
