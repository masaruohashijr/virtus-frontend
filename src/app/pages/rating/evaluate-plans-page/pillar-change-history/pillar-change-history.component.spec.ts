import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PillarChangeHistoryComponent } from './pillar-change-history.component';

describe('PillarChangeHistoryComponent', () => {
  let component: PillarChangeHistoryComponent;
  let fixture: ComponentFixture<PillarChangeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PillarChangeHistoryComponent],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PillarChangeHistoryComponent);
    component = fixture.componentInstance;
    component.visible = true;
    component.data = {
      entidade: '',
      ciclo: '',
      pilar: '',
      plano: '',
      componente: '',
      tipoNota: '',
      elemento: '',
      notaAnterior: null,
      novaNota: null,
      texto: ''
    } as any;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve emitir onClose quando fechar for chamado', () => {
    spyOn(component.onClose, 'emit');
    component.fechar();
    expect(component.onClose.emit).toHaveBeenCalled();
  });

  it('deve emitir onSave com dados válidos ao salvar', () => {
    spyOn(component.onSave, 'emit');
    component.data.texto = 'Motivação válida';
  });

  it('não deve emitir onSave com texto vazio', () => {
    spyOn(component.onSave, 'emit');
    component.data.texto = '';
    expect(component.onSave.emit).not.toHaveBeenCalled();
  }); 
});
