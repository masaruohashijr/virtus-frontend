import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCrudEditComponent } from './base-crud-edit.component';

describe('BaseCrudEditComponent', () => {
  let component: BaseCrudEditComponent;
  let fixture: ComponentFixture<BaseCrudEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseCrudEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseCrudEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
