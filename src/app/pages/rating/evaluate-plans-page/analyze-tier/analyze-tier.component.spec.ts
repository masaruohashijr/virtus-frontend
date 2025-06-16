import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzeTierComponent } from './analyze-tier.component';

describe('AnalyzeTierComponent', () => {
  let component: AnalyzeTierComponent;
  let fixture: ComponentFixture<AnalyzeTierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyzeTierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyzeTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
