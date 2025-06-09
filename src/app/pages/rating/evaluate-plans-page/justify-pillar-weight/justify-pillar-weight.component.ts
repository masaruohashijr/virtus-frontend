import { EvaluatePlansService } from 'src/app/services/rating/evaluate-plans.service';
import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { PlainMessageDialogComponent } from "../../../administration/plain-message/plain-message-dialog.component";
import { ProductPillarHistoryService } from '../../../../services/coordination/product-pillar-history.service';

// Define TreeNode interface if not imported from elsewhere
interface TreeNode {
  data: any;
  parent?: TreeNode;
}

export interface JustifyPillarWeightData {
  entidade: string;
  ciclo: string;
  pilar: string;
  plano: string;
  componente: string;
  tipoNota: string;
  elemento: string;
  notaAnterior: number | null;
  novaNota: number | null;
  texto: string;
}

@Component({
  selector: "app-justify-pillar-weight",
  templateUrl: "./justify-pillar-weight.component.html",
  styleUrls: ["./justify-pillar-weight.component.css"],
})
export class JustifyPillarWeightComponent {
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<JustifyPillarWeightData>();

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
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: JustifyPillarWeightComponent,
    private _service: EvaluatePlansService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<JustifyPillarWeightComponent>
  ) {
    this.justifyPillarWeightForm = this.formBuilder.group({
      entity: [this.data.entidade.name],
      cycle: [this.data.ciclo.name],
      pillar: [this.data.pilar.name],
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
  }

  getTitle() {
    return "Motivar Peso do Pilar " + this.data.pilar.name;
  }

  fechar() {
    this.onClose.emit();
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
        supervisorId: this.data.supervisor.id,
        novoPeso: this.data.novoPeso!,
        pesoAnterior: this.data.pesoAnterior!,
        motivacao: this.justifyPillarWeightForm.get("motivation")?.value,
      })
      .subscribe({
        next: (res: any) => {
          const mensagem = `O peso foi atualizado com sucesso de ${this.data.pesoAnterior} para ${this.data.novoPeso}.`;
          this.data.pesoAnterior = this.data.novoPeso;
          this.data.pilar.weight = this.data.novoPeso;
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
              // Fecha o modal de motivação após confirmação
              this.dialogRef.close();
            });
        },
        error: (err) => console.error("Erro ao salvar nota:", err),
      });
  }

  atualizarContador() {
    this.contador = this.data.texto?.length || 0;
  }

  parseDecimal(valor: string | null | undefined): number {
    return parseFloat((valor || "0").replace(",", "."));
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
