import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeTypeEditComponent } from './grade-type-edit.component';

describe('GradeTypeEditComponent', () => {
  let component: GradeTypeEditComponent;
  let fixture: ComponentFixture<GradeTypeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeTypeEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
