import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementChangeHistoryComponent } from './element-change-history.component';

describe('ElementChangeHistoryComponent', () => {
  let component: ElementChangeHistoryComponent;
  let fixture: ComponentFixture<ElementChangeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementChangeHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementChangeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
