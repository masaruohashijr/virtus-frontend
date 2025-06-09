import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustifyReschedulingComponent } from './justify-rescheduling.component';

describe('JustifyReschedulingComponent', () => {
  let component: JustifyReschedulingComponent;
  let fixture: ComponentFixture<JustifyReschedulingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JustifyReschedulingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JustifyReschedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
