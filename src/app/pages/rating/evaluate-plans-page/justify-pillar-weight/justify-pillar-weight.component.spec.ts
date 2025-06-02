import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { JustifyPillarWeightComponent } from './justify-pillar-weight.component';

describe('JustifyPillarWeightComponent', () => {
  let component: JustifyPillarWeightComponent;
  let fixture: ComponentFixture<JustifyPillarWeightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JustifyPillarWeightComponent],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JustifyPillarWeightComponent);
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
    component.salvar();
    expect(component.onSave.emit).toHaveBeenCalledWith(jasmine.objectContaining({ ...component.data }));
  });

  it('não deve emitir onSave com texto vazio', () => {
    spyOn(component.onSave, 'emit');
    component.data.texto = '';
    component.salvar();
    expect(component.onSave.emit).not.toHaveBeenCalled();
  });
});
