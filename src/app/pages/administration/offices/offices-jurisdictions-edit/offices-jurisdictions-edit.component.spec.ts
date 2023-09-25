import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficesJurisdictionsEditComponent } from './offices-jurisdictions-edit.component';

describe('OfficesJurisdictionsEditComponent', () => {
  let component: OfficesJurisdictionsEditComponent;
  let fixture: ComponentFixture<OfficesJurisdictionsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficesJurisdictionsEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficesJurisdictionsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
