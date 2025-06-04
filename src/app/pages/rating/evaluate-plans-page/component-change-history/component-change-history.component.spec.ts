import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentChangeHistoryComponent } from './component-change-history.component';

describe('ComponentChangeHistoryComponent', () => {
  let component: ComponentChangeHistoryComponent;
  let fixture: ComponentFixture<ComponentChangeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentChangeHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentChangeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
