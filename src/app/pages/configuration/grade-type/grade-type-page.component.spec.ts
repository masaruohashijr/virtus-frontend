import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeTypePageComponent } from './grade-type-page.component';

describe('GradeTypePageComponent', () => {
  let component: GradeTypePageComponent;
  let fixture: ComponentFixture<GradeTypePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeTypePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeTypePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
