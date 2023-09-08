import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesEditComponent } from './features-edit.component';

describe('FeaturesEditComponent', () => {
  let component: FeaturesEditComponent;
  let fixture: ComponentFixture<FeaturesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturesEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
