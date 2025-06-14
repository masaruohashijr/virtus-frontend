import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementHistoryDetailsComponent } from './element-history-details.component';


describe('ElementHistoryDetailsComponent', () => {
  let component: ElementHistoryDetailsComponent;
  let fixture: ComponentFixture<ElementHistoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementHistoryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
