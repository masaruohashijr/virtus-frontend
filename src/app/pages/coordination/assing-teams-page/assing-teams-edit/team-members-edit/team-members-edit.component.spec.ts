import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMembersEditComponent } from './team-members-edit.component';

describe('TeamMembersEditComponent', () => {
  let component: TeamMembersEditComponent;
  let fixture: ComponentFixture<TeamMembersEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMembersEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamMembersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
