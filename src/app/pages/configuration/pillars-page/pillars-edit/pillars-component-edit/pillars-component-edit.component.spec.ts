import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillarsComponentEditComponent } from './pillars-component-edit.component';

describe('PillarsComponentEditComponent', () => {
  let component: PillarsComponentEditComponent;
  let fixture: ComponentFixture<PillarsComponentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PillarsComponentEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PillarsComponentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
