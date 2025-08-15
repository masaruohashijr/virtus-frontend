import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-historical-series',
  templateUrl: './historical-series.component.html',
  styleUrls: ['./historical-series.component.css']
})
export class HistoricalSeriesComponent {

  // Colunas da tabela
  displayedColumns: string[] = ['nota', 'dataReferencia', 'criadoEm'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}
