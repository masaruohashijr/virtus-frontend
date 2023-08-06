import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillarsComponentListComponent } from './pillars-component-list.component';

describe('PillarsComponentListComponent', () => {
  let component: PillarsComponentListComponent;
  let fixture: ComponentFixture<PillarsComponentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PillarsComponentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PillarsComponentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
