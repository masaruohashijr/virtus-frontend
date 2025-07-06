import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticScoresEditComponent } from './automatic-scores-edit.component';

describe('AutomaticScoresEditComponent', () => {
  let component: AutomaticScoresEditComponent;
  let fixture: ComponentFixture<AutomaticScoresEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomaticScoresEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomaticScoresEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
