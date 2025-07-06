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

  constructor(
    public dialogRef: MatDialogRef<SyncDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { referenceDatesCadastrados: string[] },
    private fb: FormBuilder,
    private _service: IndicatorScoresService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.syncForm = this.fb.group({
      referenceDate: [
        this.getDefaultReferenceDate(),
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

    const value = refDateControl.value;

    // Verifica se o valor realmente é uma string antes de prosseguir
    if (typeof value !== "string") {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: "Erro",
          message: "O valor da competência está inválido.",
        },
      });
      return;
    }

    const refDate: string = value;
    const jaExiste = this.data.referenceDatesCadastrados?.includes(refDate);

    const continuar = () => {
      this._service.syncScores(refDate);
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: "Sucesso",
          message: `Notas de Indicadores da competência ${refDate} foram carregadas com sucesso!`,
        },
      });
      this.dialogRef.close(true);
    };

    if (jaExiste) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: "Confirmação",
          message: [
            `Já existem notas cadastradas para a referência ${refDate}.`,
            "Deseja carregar novamente?",
          ].join("\n"),
          options: 'Sim/Não',
        },        
      });

      dialogRef.afterClosed().subscribe((confirmado: boolean) => {
        if (confirmado) continuar();
      });
    } else {
      continuar();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  getDefaultReferenceDate(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${year}${month}`;
  }
}
