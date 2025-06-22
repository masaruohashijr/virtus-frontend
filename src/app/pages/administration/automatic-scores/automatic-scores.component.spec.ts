import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticScoresComponent } from './automatic-scores.component';

describe('AutomaticScoresComponent', () => {
  let component: AutomaticScoresComponent;
  let fixture: ComponentFixture<AutomaticScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomaticScoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomaticScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
