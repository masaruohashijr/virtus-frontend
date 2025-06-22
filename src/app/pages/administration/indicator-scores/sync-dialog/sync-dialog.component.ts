import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sync-dialog',
  templateUrl: './sync-dialog.component.html',
})
export class SyncDialogComponent {
  syncForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SyncDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    this.syncForm = new FormGroup({
      referenceDate: new FormControl(`${month}${year}`, [
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])[0-9]{4}$/), // MMAAAA
      ]),
    });
  }

  sync(): void {
    if (this.syncForm.valid) {
      this.dialogRef.close(this.syncForm.value.referenceDate);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
