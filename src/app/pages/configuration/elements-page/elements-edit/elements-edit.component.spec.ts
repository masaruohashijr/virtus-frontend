import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementsEditComponent } from './elements-edit.component';

describe('ElementsEditComponent', () => {
  let component: ElementsEditComponent;
  let fixture: ComponentFixture<ElementsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementsEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
