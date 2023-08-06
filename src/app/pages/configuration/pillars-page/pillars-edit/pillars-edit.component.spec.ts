import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillarsEditComponent } from './pillars-edit.component';

describe('PillarsEditComponent', () => {
  let component: PillarsEditComponent;
  let fixture: ComponentFixture<PillarsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PillarsEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PillarsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
