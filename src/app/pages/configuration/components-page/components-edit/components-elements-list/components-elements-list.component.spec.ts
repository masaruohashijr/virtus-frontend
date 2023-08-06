import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsElementsListComponent } from './components-elements-list.component';

describe('ComponentsElementsListComponent', () => {
  let component: ComponentsElementsListComponent;
  let fixture: ComponentFixture<ComponentsElementsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentsElementsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentsElementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
