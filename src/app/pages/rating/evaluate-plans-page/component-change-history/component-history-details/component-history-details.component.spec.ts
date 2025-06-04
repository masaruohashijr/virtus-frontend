import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentHistoryDetailsComponent } from './component-history-details.component';

describe('ComponentHistoryDetailsComponent', () => {
  let component: ComponentHistoryDetailsComponent;
  let fixture: ComponentFixture<ComponentHistoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentHistoryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
