import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsEditComponent } from './actions-edit.component';

describe('ActionsEditComponent', () => {
  let component: ActionsEditComponent;
  let fixture: ComponentFixture<ActionsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionsEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
