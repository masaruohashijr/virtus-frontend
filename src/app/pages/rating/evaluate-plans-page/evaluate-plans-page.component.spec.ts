import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluatePlansPageComponent } from './evaluate-plans-page.component';

describe('EvaluatePlansPageComponent', () => {
  let component: EvaluatePlansPageComponent;
  let fixture: ComponentFixture<EvaluatePlansPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluatePlansPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluatePlansPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
