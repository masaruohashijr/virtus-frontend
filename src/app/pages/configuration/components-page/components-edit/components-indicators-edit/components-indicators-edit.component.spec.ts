import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsIndicatorsEditComponent } from './components-indicators-edit.component';

describe('ComponentsIndicatorsEditComponent', () => {
  let component: ComponentsIndicatorsEditComponent;
  let fixture: ComponentFixture<ComponentsIndicatorsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentsIndicatorsEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentsIndicatorsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
