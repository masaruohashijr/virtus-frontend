import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyclesPageComponent } from './cycles-page.component';

describe('CyclesPageComponent', () => {
  let component: CyclesPageComponent;
  let fixture: ComponentFixture<CyclesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyclesPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CyclesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
