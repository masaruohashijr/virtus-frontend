import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent implements OnInit {
  title: string = 'Confirmar Exclusão';
  message: string = 'Deseja realmente excluir este item?';
  confirmLabel: string = 'Excluir';
  cancelLabel: string = 'Cancelar';

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data?: { title?: string; message?: string; options?: string }
  ) {}

  ngOnInit(): void {
    if (this.data) {
      if (this.data.title) this.title = this.data.title;
      if (this.data.message) this.message = this.data.message;

      // Processa opções personalizadas, exemplo: "Sim/Não"
      if (this.data.options) {
        const parts = this.data.options.split('/');
        if (parts.length >= 2) {
          this.confirmLabel = parts[0];
          this.cancelLabel = parts[1];
        }
      }
    }
  }

  confirmar() {
    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
