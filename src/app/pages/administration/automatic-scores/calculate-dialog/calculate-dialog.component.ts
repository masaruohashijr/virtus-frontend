import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

import { AlertDialogComponent } from "src/app/components/dialog/alert-dialog/alert-dialog.component";
import { AutomaticScoresService } from "src/app/services/administration/automatic-scores.service";
import { IndicatorScoresService } from "src/app/services/administration/indicator-scores.service";

@Component({
  selector: "app-calculate-dialog",
  templateUrl: "./calculate-dialog.component.html",
})
export class CalculateDialogComponent implements OnInit {
  calculateForm!: FormGroup;
  isLoading = false;

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<CalculateDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { ultimaReferencia: string },
    private fb: FormBuilder,
    private _service: AutomaticScoresService,
    @Inject(MatDialog) private dialog: MatDialog,
    @Inject(MatSnackBar) private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.calculateForm = this.fb.group({
      referenceDate: [
        this.data.ultimaReferencia || "",
        [Validators.required, Validators.pattern(/^[0-9]{4}(0[1-9]|1[0-2])$/)],
      ],
    });
  }

  calculate(): void {
    const refDateControl = this.calculateForm.get("referenceDate");

    if (!refDateControl || refDateControl.invalid) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: "Erro",
          message: "Por favor, informe uma competência válida.",
        },
      });
      return;
    }

    const referenceDate = refDateControl.value;

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

    this._service.calculateScores(referenceDate).subscribe({
      next: () => {
        this.dialog.open(AlertDialogComponent, {
          data: {
            title: "Sucesso",
            message: `Notas da Referência ${referenceDate} foram calculadas com sucesso.`,
          },
        });

        this._snackBar.open(
          `Notas da Referência ${referenceDate} foram calculadas com sucesso.`,
          "Fechar",
          { duration: 3000 }
        );

        this.close();
      },
      error: (err) => {
        console.error("Erro no cálculo:", err);
        this.dialog.open(AlertDialogComponent, {
          data: {
            title: "Erro",
            message: "Falha ao calcular as notas. Tente novamente.",
          },
        });
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close(this.calculateForm.get("referenceDate")?.value);
  }
}
