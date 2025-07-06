import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsIndicatorsListComponent } from './components-indicators-list.component';

describe('ComponentsIndicatorsListComponent', () => {
  let component: ComponentsIndicatorsListComponent;
  let fixture: ComponentFixture<ComponentsIndicatorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentsIndicatorsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentsIndicatorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
