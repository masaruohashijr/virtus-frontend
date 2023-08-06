import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsElementsEditComponent } from './components-elements-edit.component';

describe('ComponentsElementsEditComponent', () => {
  let component: ComponentsElementsEditComponent;
  let fixture: ComponentFixture<ComponentsElementsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentsElementsEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentsElementsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
