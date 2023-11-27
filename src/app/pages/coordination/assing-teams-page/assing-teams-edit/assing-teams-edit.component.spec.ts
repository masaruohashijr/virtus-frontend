import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssingTeamsEditComponent } from './assing-teams-edit.component';

describe('AssingTeamsEditComponent', () => {
  let component: AssingTeamsEditComponent;
  let fixture: ComponentFixture<AssingTeamsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssingTeamsEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssingTeamsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
