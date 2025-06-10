import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-component-history-details',
  templateUrl: './component-history-details.component.html',
})
export class ComponentHistoryDetailsComponent implements OnInit {
  tipoAlteracaoLabel: string = '';
  valorAnterior: string = '';
  valorAtual: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    const tipo = this.data.tipoAlteracao;

    switch (tipo) {
      case 'I':
        this.tipoAlteracaoLabel = 'Inicia Em';
        this.valorAnterior = this.data.iniciaEmAnterior ?? '—';
        this.valorAtual = this.data.iniciaEm ?? '—';
        break;
      case 'T':
        this.tipoAlteracaoLabel = 'Termina Em';
        this.valorAnterior = this.data.terminaEmAnterior ?? '—';
        this.valorAtual = this.data.terminaEm ?? '—';
        break;
      case 'P':
        this.tipoAlteracaoLabel = 'Planos';
        this.valorAnterior = this.data.configAnterior ?? 'Vazio';
        this.valorAtual = this.data.config ?? 'Vazio';
        break;
      case 'R':
        this.tipoAlteracaoLabel = 'Auditor';
        this.valorAnterior = this.data.auditorAnteriorName ?? '—';
        this.valorAtual = this.data.auditorName ?? '—';
        break;
      default:
        this.tipoAlteracaoLabel = '—';
        this.valorAnterior = '—';
        this.valorAtual = '—';
    }
  }
}
