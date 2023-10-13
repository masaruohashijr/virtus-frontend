import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartCyclesEditComponent } from './start-cycles-edit.component';

describe('StartCyclesEditComponent', () => {
  let component: StartCyclesEditComponent;
  let fixture: ComponentFixture<StartCyclesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartCyclesEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartCyclesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
