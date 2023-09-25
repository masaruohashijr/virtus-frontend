import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JurisdictionsListComponent } from './jurisdictions-list.component';

describe('JurisdictionsListComponent', () => {
  let component: JurisdictionsListComponent;
  let fixture: ComponentFixture<JurisdictionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JurisdictionsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JurisdictionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
