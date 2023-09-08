import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesEditComponent } from './activities-edit.component';

describe('ActivitiesEditComponent', () => {
  let component: ActivitiesEditComponent;
  let fixture: ComponentFixture<ActivitiesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitiesEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitiesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
