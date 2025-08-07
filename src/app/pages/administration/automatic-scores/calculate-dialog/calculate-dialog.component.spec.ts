import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateDialogComponent } from './calculate-dialog.component';

describe('CalculateDialogComponent', () => {
  let component: CalculateDialogComponent;
  let fixture: ComponentFixture<CalculateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
