import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssingTeamsPageComponent } from './assing-teams-page.component';

describe('AssingTeamsPageComponent', () => {
  let component: AssingTeamsPageComponent;
  let fixture: ComponentFixture<AssingTeamsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssingTeamsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssingTeamsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
