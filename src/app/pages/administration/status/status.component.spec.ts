import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusPageComponent } from './status.component';

describe('StatusComponent', () => {
  let component: StatusPageComponent;
  let fixture: ComponentFixture<StatusPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
