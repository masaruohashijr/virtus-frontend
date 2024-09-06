import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPlansComponent } from './config-plans-edit.component';

describe('ConfigPlansComponent', () => {
  let component: ConfigPlansComponent;
  let fixture: ComponentFixture<ConfigPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigPlansComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
