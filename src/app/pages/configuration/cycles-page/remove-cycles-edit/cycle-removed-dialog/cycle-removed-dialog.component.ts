import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cycle-removed-dialog',
  templateUrl: './cycle-removed-dialog.component.html',
  styleUrls: ['./cycle-removed-dialog.component.css'],
})
export class CycleRemovedDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CycleRemovedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
