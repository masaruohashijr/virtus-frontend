import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsGradeListComponent } from './components-grade-list.component';

describe('ComponentsGradeListComponent', () => {
  let component: ComponentsGradeListComponent;
  let fixture: ComponentFixture<ComponentsGradeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentsGradeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentsGradeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
