import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface MotivarNotaData {
  entidade: string;
  ciclo: string;
  pilar: string;
  plano: string;
  componente: string;
  tipoNota: string;
  elemento: string;
  notaAnterior: number | null;
  novaNota: number | null;
  texto: string;
}

@Component({
  selector: 'app-motivar-nota',
  templateUrl: './motivar-nota.component.html',
  styleUrls: ['./motivar-nota.component.css']
})
export class MotivarNotaComponent {
  @Input() visible: boolean = false;
  @Input() data!: MotivarNotaData;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<MotivarNotaData>();

  contador = 0;

  fechar() {
    this.onClose.emit();
    this.contador = 0;
  }

  salvar() {
    if (!this.data.texto || this.data.texto.trim().length === 0) {
      alert('A motivação da nota é obrigatória.');
      return;
    }
    this.onSave.emit(this.data);
    this.fechar();
  }

  atualizarContador() {
    this.contador = this.data.texto?.length || 0;
  }
}
