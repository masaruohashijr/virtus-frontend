import { HttpClient } from "@angular/common/http";
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { PlainMessageDialogComponent } from "src/app/pages/administration/plain-message/plain-message-dialog.component";
import { EvaluatePlansService } from "src/app/services/rating/evaluate-plans.service";

@Component({
  selector: "app-analyze-tier",
  templateUrl: "./analyze-tier.component.html",
  styleUrls: ["./analyze-tier.component.css"],
})
export class AnalyzeTierComponent implements OnInit, OnDestroy {
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<AnalyzeTierComponent>();
  analysis: string = "";
  objectType: string = "";
  loading = true;
  contador = 0;
  analyzeTierForm!: FormGroup;
  entidade: any;
  ciclo: any;
  pilar: any;
  componente: any;
  plano: any;
  tipoNota: any;
  elemento: any;
  item: any;
  weight: any;
  grade: any;
  errorMessage: string = "";
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: AnalyzeTierComponent,
    private _service: EvaluatePlansService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AnalyzeTierComponent>
  ) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.analyzeTierForm = this.formBuilder.group({
      entity: [{ value: this.data?.entidade?.name, disabled: true }],
      cycle: [{ value: this.data?.ciclo?.name, disabled: true }],
      pillar: [{ value: this.data?.pilar?.name, disabled: true }],
      component: [{ value: this.data?.componente?.name, disabled: true }],
      plan: [{ value: this.data?.plano?.name, disabled: true }],
      gradeType: [{ value: this.data?.tipoNota?.name, disabled: true }],
      element: [{ value: this.data?.elemento?.name, disabled: true }],
      item: [{ value: this.data?.item?.name, disabled: true }],
      weight: [{ value: this.data?.weight, disabled: true }],
      grade: [{ value: this.data?.grade, disabled: true }],
      analysis: [
        this.data?.analysis || "",
        [
          Validators.maxLength(8000),
        ],
      ],
      objectType: [this.data?.objectType || ""],
    });
    this.atualizarContador();
    this.analyzeTierForm
      .get("analysis")
      ?.valueChanges.subscribe((val: string) => {
        this.contador = val?.length || 0;

        if (this.contador > 8000) {
          this.errorMessage = "Limite de 8000 caracteres atingido.";
          const truncated = val.substring(0, 8000);
          this.analyzeTierForm
            .get("analysis")
            ?.setValue(truncated, { emitEvent: false });
          this.contador = 8000;
        } else if (this.contador < 4 && this.contador >= 0) {
          this.errorMessage = "A análise deve conter entre 4 e 8000 caracteres.";
        } else {
          this.errorMessage = "";
        }
      });
  }

  getTitle() {
    let name = "";
    switch (this.data?.objectType) {
      case "Entidade":
        name = this.data?.entidade?.name || "";
        break;
      case "Ciclo":
        name = this.data?.ciclo?.name || "";
        break;
      case "Pilar":
        name = this.data?.pilar?.name || "";
        break;
      case "Componente":
        name = this.data?.componente?.name || "";
        break;
      case "Plano":
        name = this.data?.plano?.name || "";
        break;
      case "Tipo Nota":
        name = this.data?.tipoNota?.name || "";
        break;
      case "Elemento":
        name = this.data?.elemento?.name || "";
        break;
      case "Item":
        name = this.data?.item?.name || "";
        break;
      default:
        name = "";
    }
    return `Análise do ${this.data?.objectType} :: ${name}`;
  }
  fechar() {
    // Restaura os valores originais manualmente
    this.onClose.emit();
    this.contador = 0;
  }

  atualizarContador() {
    this.contador = this.data.analysis?.length || 0;
  }

  salvar() {
    if (this.analyzeTierForm.invalid) return;

    const analise = this.analyzeTierForm.get("analysis")?.value;

    interface UpdateAnalysisResponse {
      [key: string]: any;
    }

    this._service
      .updateAnalysis(
        {
          entidadeId: this.data.entidade.id,
          cicloId: this.data.ciclo?.id,
          pilarId: this.data.pilar?.id ?? 0,
          componenteId: this.data.componente?.id ?? 0,
          planoId: this.data.plano?.id ?? 0,
          tipoNotaId: this.data.tipoNota?.id ?? 0,
          elementoId: this.data.elemento?.id ?? 0,
          itemId: this.data.item?.id ?? 0,
          analise: this.analyzeTierForm.get("analysis")?.value,
        },
        this.data.objectType
      )
      .subscribe({
        next: (res: UpdateAnalysisResponse) => {
          const mensagem = `A Análise foi atualizada com sucesso.`;
          this.dialog
            .open(PlainMessageDialogComponent, {
              width: "400px",
              data: { message: mensagem },
            })
            .afterClosed()
            .subscribe(() => {
              this.onSave.emit(this);
              this.dialogRef.close();
            });
        },
        error: (err: any) => console.error("Erro ao salvar nota:", err),
      });
  }
}
