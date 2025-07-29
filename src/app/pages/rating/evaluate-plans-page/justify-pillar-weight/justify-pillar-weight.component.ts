import { EvaluatePlansService } from "src/app/services/rating/evaluate-plans.service";
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewChild,
  OnInit,
  OnDestroy,
  ElementRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { PlainMessageDialogComponent } from "../../../administration/plain-message/plain-message-dialog.component";

// Define TreeNode interface if not imported from elsewhere
interface TreeNode {
  data: any;
  parent?: TreeNode;
}

export interface JustifyPillarWeightData {
  entidade: any;
  ciclo: any;
  pilar: { id: any; name: string; weight?: number };
  plano: string;
  componente: string;
  tipoNota: string;
  elemento: string;
  pesoAnterior: number | null;
  novoPeso: number | null;
  texto: string;
  supervisor?: any;
  rowNode?: TreeNode;
}

@Component({
  selector: "app-justify-pillar-weight",
  templateUrl: "./justify-pillar-weight.component.html",
  styleUrls: ["./justify-pillar-weight.component.css"],
})
export class JustifyPillarWeightComponent implements OnInit, OnDestroy {
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<JustifyPillarWeightData>();
  @ViewChild("motivationInput") motivationInput!: ElementRef;

  saved: boolean = false;
  contador = 0;
  justifyPillarWeightForm!: FormGroup;
  entidade: any;
  ciclo: any;
  pilar: any;
  supervisor: any;
  texto: any;
  novoPeso: any;
  pesoAnterior: any;
  rowNode: TreeNode | undefined;
  weight: any;

  originalPesoAnterior: number | null = null;
  originalPilarPeso: number | null = null;
  errorMessage: string = "";

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: JustifyPillarWeightData,
    private _service: EvaluatePlansService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<JustifyPillarWeightData>
  ) {}

  ngOnInit(): void {
    this.justifyPillarWeightForm = this.formBuilder.group({
      entity: [{ value: this.data.entidade.name, disabled: true }],
      cycle: [{ value: this.data.ciclo.name, disabled: true }],
      pillar: [{ value: this.data.pilar.name, disabled: true }],
      novoPeso: [
        this.data.novoPeso,
        [Validators.required, Validators.min(0.01), Validators.max(100)],
      ],
      pesoAnterior: [this.data.pesoAnterior],
      motivation: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(400),
        ],
      ],
    });
    this.originalPesoAnterior = this.data.pesoAnterior;
    this.originalPilarPeso = this.data.pilar.weight ?? null;
    this.justifyPillarWeightForm
      .get("motivation")
      ?.valueChanges.subscribe((val: string) => {
        this.contador = val?.length || 0;

        if (this.contador > 400) {
          this.errorMessage = "Limite de 400 caracteres atingido.";
          const truncated = val.substring(0, 400);
          this.justifyPillarWeightForm
            .get("motivation")
            ?.setValue(truncated, { emitEvent: false });
          this.contador = 400;
        } else if (this.contador < 4 && this.contador >= 0) {
          this.errorMessage = "A motivação deve conter entre 4 e 400 caracteres.";
        } else {
          this.errorMessage = "";
        }
      });

    setTimeout(() => {
      this.motivationInput?.nativeElement?.focus();
    }, 200);

    this.dialogRef.afterClosed().subscribe((foiSalvo) => {
      if (!foiSalvo) {
        this.onClose.emit();
      }
    });
  }

  ngOnDestroy(): void {
    //this.restaurarValoresOriginais();
  }

  getTitle() {
    return "Motivar Peso do Pilar " + this.data.pilar.name;
  }

  fechar() {
    this.restaurarValoresOriginais();
    this.dialogRef.close(false); // <-- Indica cancelamento
    this.contador = 0;
  }

  salvar() {
    if (this.justifyPillarWeightForm.invalid) return;

    const motivacao = this.justifyPillarWeightForm.get("motivation")?.value;

    this._service
      .salvarPesoPilar({
        entidadeId: this.data.entidade.id,
        cicloId: this.data.ciclo.id,
        pilarId: this.data.pilar.id,
        supervisorId: this.data.rowNode?.data?.supervisor?.id,
        novoPeso: this.data.novoPeso!,
        pesoAnterior: this.data.pesoAnterior!,
        motivacao: motivacao,
      })
      .subscribe({
        next: (res: any) => {
          this.saved = true;

          const mensagem = `O peso foi atualizado com sucesso de ${this.data.pesoAnterior} para ${this.data.novoPeso}.`;
          this.data.pesoAnterior = this.data.novoPeso;
          this.data.pilar.weight =
            this.data.novoPeso === null ? undefined : this.data.novoPeso;

          const cicloNota = this.parseDecimal(res.cicloNota);
          const cicloNode = this.data.rowNode
            ? this.subirAtePorNode(this.data.rowNode, "Ciclo")
            : null;
          if (cicloNode && cicloNota) {
            cicloNode.data.grade = cicloNota;
          }

          this.dialog
            .open(PlainMessageDialogComponent, {
              width: "400px",
              data: { message: mensagem },
            })
            .afterClosed()
            .subscribe(() => {
              this.dialogRef.close(true); // <-- Retorna true ao componente pai
            });
        },
        error: (err) => {
          console.error("Erro ao salvar peso:", err);
          this.dialog.open(PlainMessageDialogComponent, {
            width: "400px",
            data: {
              message: "Ocorreu um erro ao salvar. Tente novamente mais tarde.",
            },
          });
        },
      });
  }

  atualizarContador() {
    this.contador = this.data.texto?.length || 0;
  }

  parseDecimal(valor: string | null | undefined): number {
    const v = valor?.replace(",", ".");
    const parsed = parseFloat(v || "0");
    return isNaN(parsed) ? 0 : parsed;
  }

  private restaurarValoresOriginais() {
    this.data.pesoAnterior = this.originalPesoAnterior;
    this.data.pilar.weight =
      this.originalPilarPeso === null ? undefined : this.originalPilarPeso;
  }

  subirAtePorNode(node: TreeNode, tipo: string): TreeNode | null {
    let current: TreeNode | undefined = node.parent;
    while (current) {
      if (current.data.objectType === tipo) {
        return current;
      }
      current = current.parent;
    }
    return null;
  }
}
