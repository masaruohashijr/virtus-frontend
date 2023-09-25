import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JurisdictionsEditComponent } from './jurisdictions-edit.component';

describe('JurisdictionsEditComponent', () => {
  let component: JurisdictionsEditComponent;
  let fixture: ComponentFixture<JurisdictionsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JurisdictionsEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JurisdictionsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
