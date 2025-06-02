import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mensagem-dialog',
  template: `
    <h2>{{ data.title || 'Mensagem' }}</h2>
    <div class="dialog-content">
      {{ data.message }}
    </div>
    <div class="dialog-footer" style="text-align: right; margin-top: 1em;">
      <button (click)="dialogRef.close()">Fechar</button>
    </div>
  `,
})
export class PlainMessageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PlainMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; message: string }
  ) {}
}
