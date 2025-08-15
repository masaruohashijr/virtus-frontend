import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalSeriesComponent } from './historical-series.component';

describe('HistoricalSeriesComponent', () => {
  let component: HistoricalSeriesComponent;
  let fixture: ComponentFixture<HistoricalSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalSeriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricalSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
