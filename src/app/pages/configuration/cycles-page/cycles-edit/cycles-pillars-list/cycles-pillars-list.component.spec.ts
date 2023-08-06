import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyclesPillarsListComponent } from './cycles-pillars-list.component';

describe('CyclesPillarsListComponent', () => {
  let component: CyclesPillarsListComponent;
  let fixture: ComponentFixture<CyclesPillarsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyclesPillarsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CyclesPillarsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
