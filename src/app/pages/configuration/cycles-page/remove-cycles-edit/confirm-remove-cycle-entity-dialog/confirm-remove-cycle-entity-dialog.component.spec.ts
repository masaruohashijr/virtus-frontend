import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRemoveCycleEntityDialogComponent } from './confirm-remove-cycle-entity-dialog.component';

describe('ConfirmRemoveCycleEntityDialogComponent', () => {
  let component: ConfirmRemoveCycleEntityDialogComponent;
  let fixture: ComponentFixture<ConfirmRemoveCycleEntityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmRemoveCycleEntityDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmRemoveCycleEntityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
