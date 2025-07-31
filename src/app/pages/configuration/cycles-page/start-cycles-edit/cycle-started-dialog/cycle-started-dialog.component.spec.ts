import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleStartedDialogComponent } from './cycle-started-dialog.component';

describe('CycleStartedDialogComponent', () => {
  let component: CycleStartedDialogComponent;
  let fixture: ComponentFixture<CycleStartedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CycleStartedDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleStartedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
