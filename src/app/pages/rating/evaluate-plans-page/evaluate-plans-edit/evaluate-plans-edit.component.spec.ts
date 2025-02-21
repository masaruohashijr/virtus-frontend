import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluatePlansEditComponent } from './evaluate-plans-edit.component';

describe('EvaluatePlansEditComponent', () => {
  let component: EvaluatePlansEditComponent;
  let fixture: ComponentFixture<EvaluatePlansEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluatePlansEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluatePlansEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
