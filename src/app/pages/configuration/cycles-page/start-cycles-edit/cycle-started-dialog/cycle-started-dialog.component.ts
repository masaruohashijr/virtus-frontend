import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-cycle-started-dialog",
  templateUrl: "./cycle-started-dialog.component.html",
})
export class CycleStartedDialogComponent {
  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<CycleStartedDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; message: string }
  ) {}
}
