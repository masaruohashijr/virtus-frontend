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

export interface MotivarPesoPilarData {
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
  selector: "app-motivar-peso-pilar",
  templateUrl: "./motivar-peso-pilar.component.html",
  styleUrls: ["./motivar-peso-pilar.component.css"],
})
export class MotivarPesoPilarComponent {
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<MotivarPesoPilarData>();

  contador = 0;
  motivarPesoPilarForm!: FormGroup;
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
    @Inject(MAT_DIALOG_DATA) public data: MotivarPesoPilarComponent,
    private evaluatePlansService: EvaluatePlansService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<MotivarPesoPilarComponent>
  ) {
    this.motivarPesoPilarForm = this.formBuilder.group({
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
    return "Motivar Nota";
  }

  fechar() {
    this.onClose.emit();
    this.contador = 0;
  }

  salvar() {
    if (this.motivarPesoPilarForm.invalid) return;

    const motivacao = this.motivarPesoPilarForm.get("motivation")?.value;

    this.evaluatePlansService
      .salvarPesoPilar({
        entidadeId: this.data.entidade.id,
        cicloId: this.data.ciclo.id,
        pilarId: this.data.pilar.id,
        novoPeso: this.data.novoPeso!,
        pesoAnterior: this.data.pesoAnterior!,
        motivacao: this.motivarPesoPilarForm.get("motivation")?.value,
      })
      .subscribe({
        next: (res: any) => {
          const mensagem = `O peso foi atualizado com sucesso de ${this.data.pesoAnterior} para ${this.data.novoPeso}.`;
          // Atualiza o valor da nota no nó do ciclo
          const cicloNota = parseFloat(res.cicloNota || "0");
          const cicloNode = this.data.rowNode
            ? this.subirAtePorNode(this.data.rowNode, "Ciclo")
            : null;
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
