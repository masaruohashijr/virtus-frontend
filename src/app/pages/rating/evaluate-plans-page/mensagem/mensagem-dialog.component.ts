import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mensagem-dialog',
  template: `
    <h2>Sucesso</h2>
    <div class="dialog-content">
      {{ data.message }}
    </div>
    <div class="dialog-footer" style="text-align: right; margin-top: 1em;">
      <button (click)="dialogRef.close()">Fechar</button>
    </div>
  `,
})
export class MensagemDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MensagemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}
}
