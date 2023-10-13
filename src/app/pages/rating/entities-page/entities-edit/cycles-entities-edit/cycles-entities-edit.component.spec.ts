import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyclesEntitiesEditComponent } from './cycles-entities-edit.component';

describe('CyclesEntitiesEditComponent', () => {
  let component: CyclesEntitiesEditComponent;
  let fixture: ComponentFixture<CyclesEntitiesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyclesEntitiesEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CyclesEntitiesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
