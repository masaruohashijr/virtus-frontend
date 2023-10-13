import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitiesEditComponent } from './entities-edit.component';

describe('EntitiesEditComponent', () => {
  let component: EntitiesEditComponent;
  let fixture: ComponentFixture<EntitiesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntitiesEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntitiesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
