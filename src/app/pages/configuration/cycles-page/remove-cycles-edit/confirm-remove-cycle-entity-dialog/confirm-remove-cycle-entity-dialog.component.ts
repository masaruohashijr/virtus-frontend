import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';

@Component({
  selector: 'app-confirm-remove-cycle-entity-dialog',
  templateUrl: './confirm-remove-cycle-entity-dialog.component.html',
})
export class ConfirmRemoveCycleEntityDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmRemoveCycleEntityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { entity: EntityVirtusDTO }
  ) {}

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
