import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsPageComponent } from './indicators-page.component';

describe('IndicatorsComponent', () => {
  let component: IndicatorsPageComponent;
  let fixture: ComponentFixture<IndicatorsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatorsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
