import { MatSnackBar } from "@angular/material/snack-bar";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { AlertDialogComponent } from "src/app/components/dialog/alert-dialog/alert-dialog.component";
import { ConfirmationDialogComponent } from "src/app/components/dialog/confirmation-dialog/confirmation-dialog.component";
import { IndicatorScoresService } from "src/app/services/administration/indicator-scores.service";

@Component({
  selector: "app-sync-dialog",
  templateUrl: "./sync-dialog.component.html",
})
export class SyncDialogComponent implements OnInit {
  syncForm!: FormGroup;
  isLoading = false;
  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<SyncDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { ultimaReferencia: string },
    private fb: FormBuilder,
    private _service: IndicatorScoresService,
    @Inject(MatDialog) private dialog: MatDialog,
    @Inject(MatSnackBar) private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.syncForm = this.fb.group({
      referenceDate: [
        this.data.ultimaReferencia || "",
        [Validators.required, Validators.pattern(/^[0-9]{4}(0[1-9]|1[0-2])$/)],
      ],
    });
  }

  sync(): void {
    const refDateControl = this.syncForm.get("referenceDate");

    if (!refDateControl || refDateControl.invalid) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: "Erro",
          message: "Por favor, informe uma competência válida.",
        },
      });
      return;
    }

    const referenceDate = refDateControl?.value;

    // Verifica se o valor realmente é uma string antes de prosseguir
    if (typeof referenceDate !== "string") {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: "Erro",
          message: "O valor da competência está inválido.",
        },
      });
      return;
    }
    this.isLoading = true;
    this._service!.syncScores(referenceDate).subscribe({
      next: () => {
        this.dialog.open(AlertDialogComponent, {
          data: {
            title: "Sucesso",
            message: `Notas da Referência ${referenceDate} foram sincronizadas com sucesso.`,
          },
        });
        this._snackBar.open(
          `Notas da Referência ${referenceDate} foram sincronizadas com sucesso.`,
          "Fechar",
          { duration: 3000 }
        );

        this.close();
      },
      error: (err) => {
        console.error("Erro na sincronização:", err);
        this.dialog.open(AlertDialogComponent, {
          data: {
            title: "Erro",
            message: "Falha ao sincronizar as notas. Tente novamente.",
          },
        });
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close(this.syncForm.get("referenceDate")?.value);
  }
}
