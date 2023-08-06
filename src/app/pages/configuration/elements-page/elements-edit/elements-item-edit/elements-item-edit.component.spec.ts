import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementsItemEditComponent } from './elements-item-edit.component';

describe('ElementsItemEditComponent', () => {
  let component: ElementsItemEditComponent;
  let fixture: ComponentFixture<ElementsItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementsItemEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementsItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
