import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyclesEditComponent } from './cycles-edit.component';

describe('CyclesEditComponent', () => {
  let component: CyclesEditComponent;
  let fixture: ComponentFixture<CyclesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyclesEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CyclesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
