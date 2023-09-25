import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficesMembersEditComponent } from './offices-members-edit.component';

describe('OfficesMembersEditComponent', () => {
  let component: OfficesMembersEditComponent;
  let fixture: ComponentFixture<OfficesMembersEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficesMembersEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficesMembersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
