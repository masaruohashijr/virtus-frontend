import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyclesPillarsEditComponent } from './cycles-pillars-edit.component';

describe('CyclesPillarsEditComponent', () => {
  let component: CyclesPillarsEditComponent;
  let fixture: ComponentFixture<CyclesPillarsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyclesPillarsEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CyclesPillarsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
