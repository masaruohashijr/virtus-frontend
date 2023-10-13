import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyclesEntitiesListComponent } from './cycles-entities-list.component';

describe('CyclesEntitiesListComponent', () => {
  let component: CyclesEntitiesListComponent;
  let fixture: ComponentFixture<CyclesEntitiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyclesEntitiesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CyclesEntitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
