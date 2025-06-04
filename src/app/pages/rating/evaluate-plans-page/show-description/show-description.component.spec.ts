import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDescriptionComponent } from './show-description.component';

describe('ShowDescriptionComponent', () => {
  let component: ShowDescriptionComponent;
  let fixture: ComponentFixture<ShowDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
