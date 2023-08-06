import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementsItemListComponent } from './elements-item-list.component';

describe('ElementsItemListComponent', () => {
  let component: ElementsItemListComponent;
  let fixture: ComponentFixture<ElementsItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementsItemListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementsItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
