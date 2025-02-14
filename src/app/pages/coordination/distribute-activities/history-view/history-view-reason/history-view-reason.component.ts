import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HistoryComponentDTO } from 'src/app/domain/dto/history-component';

@Component({
  selector: 'app-history-view-reason',
  templateUrl: './history-view-reason.component.html',
  styleUrls: ['./history-view-reason.component.css']
})
export class HistoryViewReasonComponent implements OnInit {

  detailsForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<HistoryViewReasonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HistoryComponentDTO,
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    console.log(this.data)
    this.detailsForm = this.fb.group({
      tipoAlteracao: [{ value: this.data.tipoAlteracao, disabled: true }],
      configAnterior: [{ value: this.data.configAnterior, disabled: true }],
      config: [{ value: this.data.config, disabled: true }],
      authorName: [{ value: this.data.authorName, disabled: true }],
      alteradoEm: [{ value: this.data.alteradoEm, disabled: true }],
      motivacao: [{ value: this.data.motivacao, disabled: true }]
    });
  }

  fechar(): void {
    this.dialogRef.close();
  }

  getTitle() {
    return "Motivo Histórico"
  }

}
