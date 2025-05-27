import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from "@angular/material/dialog";
import { EvaluatePlansService } from "src/app/services/rating/evaluate-plans.service";
import { MensagemDialogComponent } from "../mensagem/mensagem-dialog.component";

// Define TreeNode interface if not imported from elsewhere
interface TreeNode {
  data: any;
  parent?: TreeNode;
}

export interface MotivarPesoData {
  entidade: string;
  ciclo: string;
  pilar: string;
  plano: string;
  componente: string;
  tipoNota: string;
  elemento: string;
  pesoAnterior: number | null;
  novoPeso: number | null;
  texto: string;
}

@Component({
  selector: "app-motivar-peso",
  templateUrl: "./motivar-peso.component.html",
  styleUrls: ["./motivar-peso.component.css"],
})
export class MotivarPesoComponent {
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<MotivarPesoData>();

  contador = 0;
  motivarPesoForm!: FormGroup;
  entidade: any;
  ciclo: any;
  pilar: any;
  componente: any;
  tipoNota: any;
  elemento: any;
  texto: any;
  plano: any;
  novoPeso: any;
  pesoAnterior: any;
  rowNode: TreeNode | undefined;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: MotivarPesoComponent,
    private evaluatePlansService: EvaluatePlansService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<MotivarPesoComponent>
  ) {
    this.motivarPesoForm = this.formBuilder.group({
      entity: [this.data.entidade.name],
      cycle: [this.data.ciclo.name],
      pillar: [this.data.pilar.name],
      plan: [this.data.plano.name],
      component: [this.data.componente.name],
      gradeType: [this.data.tipoNota.name],
      element: [this.data.elemento.name],
      novoPeso: [this.data.novoPeso],
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
    return "Motivar Nota";
  }

  fechar() {
    this.onClose.emit();
    this.contador = 0;
  }

  salvar() {
    if (this.motivarPesoForm.invalid) return;

    const motivacao = this.motivarPesoForm.get("motivation")?.value;

    this.evaluatePlansService
      .salvarPesoElemento({
        entidadeId: this.data.entidade.id,
        cicloId: this.data.ciclo.id,
        pilarId: this.data.pilar.id,
        planoId: this.data.plano.id,
        componenteId: this.data.componente.id,
        tipoNotaId: this.data.tipoNota.id,
        elementoId: this.data.elemento.id,
        novoPeso: this.data.novoPeso!,
        pesoAnterior: this.data.pesoAnterior!,
        motivacao: this.motivarPesoForm.get("motivation")?.value,
      })
      .subscribe({
        next: (res: any) => {
          const mensagem = `A nota foi atualizada com sucesso de ${this.data.pesoAnterior} para ${this.data.novoPeso}.`;
          // Atualiza o valor da nota no nó do ciclo          
          const cicloNota = parseFloat(res.cicloNota || "0");
          const cicloNode = this.data.rowNode ? this.subirAtePorNode(this.data.rowNode, "Ciclo") : null;
          if (cicloNode && cicloNota) {
            cicloNode.data.grade = cicloNota;
          }

          this.dialog
            .open(MensagemDialogComponent, {
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
