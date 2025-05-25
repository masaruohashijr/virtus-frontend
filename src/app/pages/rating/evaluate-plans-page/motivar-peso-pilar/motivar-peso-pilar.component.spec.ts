import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MotivarPesoPilarComponent } from './motivar-peso-pilar.component';

describe('MotivarPesoPilarComponent', () => {
  let component: MotivarPesoPilarComponent;
  let fixture: ComponentFixture<MotivarPesoPilarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MotivarPesoPilarComponent],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivarPesoPilarComponent);
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
    expect(component.onSave.emit).toHaveBeenCalledWith(component.data);
  });

  it('não deve emitir onSave com texto vazio', () => {
    spyOn(component.onSave, 'emit');
    component.data.texto = '';
    component.salvar();
    expect(component.onSave.emit).not.toHaveBeenCalled();
  });
});
