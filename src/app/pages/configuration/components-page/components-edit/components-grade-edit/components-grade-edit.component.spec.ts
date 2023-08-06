import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsGradeEditComponent } from './components-grade-edit.component';

describe('ComponentsGradeEditComponent', () => {
  let component: ComponentsGradeEditComponent;
  let fixture: ComponentFixture<ComponentsGradeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentsGradeEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentsGradeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
