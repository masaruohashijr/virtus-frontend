import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCrudPageComponent } from './base-crud-page.component';

describe('BaseCrudPageComponent', () => {
  let component: BaseCrudPageComponent;
  let fixture: ComponentFixture<BaseCrudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseCrudPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseCrudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
