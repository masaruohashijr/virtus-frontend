import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustifyAuditorReplacementComponent } from './justify-auditor-replacement.component';

describe('JustifyAuditorReplacementComponent', () => {
  let component: JustifyAuditorReplacementComponent;
  let fixture: ComponentFixture<JustifyAuditorReplacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JustifyAuditorReplacementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JustifyAuditorReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
