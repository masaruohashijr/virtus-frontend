import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateAutomaticScoreComponent } from './evaluate-automatic-score.component';
import { beforeEach, describe, it } from 'node:test';

describe('EvaluateAutomaticScoreComponent', () => {
  let component: EvaluateAutomaticScoreComponent;
  let fixture: ComponentFixture<EvaluateAutomaticScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluateAutomaticScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluateAutomaticScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


