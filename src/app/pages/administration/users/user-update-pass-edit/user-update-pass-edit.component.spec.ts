import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpdatePassEditComponent } from './user-update-pass-edit.component';

describe('UserUpdatePassEditComponent', () => {
  let component: UserUpdatePassEditComponent;
  let fixture: ComponentFixture<UserUpdatePassEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserUpdatePassEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserUpdatePassEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
