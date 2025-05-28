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

export interface MotivarNotaData {
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
  selector: "app-motivar-nota",
  templateUrl: "./motivar-nota.component.html",
  styleUrls: ["./motivar-nota.component.css"],
})
export class MotivarNotaComponent {
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<MotivarNotaData>();

  contador = 0;
  motivarNotaForm!: FormGroup;
  entidade: any;
  ciclo: any;
  pilar: any;
  componente: any;
  tipoNota: any;
  elemento: any;
  texto: any;
  plano: any;
  novaNota: any;
  notaAnterior: any;
  rowNode: TreeNode | undefined;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: MotivarNotaComponent,
    private evaluatePlansService: EvaluatePlansService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<MotivarNotaComponent>
  ) {
    this.motivarNotaForm = this.formBuilder.group({
      entity: [this.data.entidade.name],
      cycle: [this.data.ciclo.name],
      pillar: [this.data.pilar.name],
      plan: [this.data.plano.name],
      component: [this.data.componente.name],
      gradeType: [this.data.tipoNota.name],
      element: [this.data.elemento.name],
      novaNota: [this.data.novaNota],
      notaAnterior: [this.data.notaAnterior],
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
    if (this.motivarNotaForm.invalid) return;

    const motivacao = this.motivarNotaForm.get("motivation")?.value;

    this.evaluatePlansService
      .salvarNotaElemento({
        entidadeId: this.data.entidade.id,
        cicloId: this.data.ciclo.id,
        pilarId: this.data.pilar.id,
        planoId: this.data.plano.id,
        componenteId: this.data.componente.id,
        tipoNotaId: this.data.tipoNota.id,
        elementoId: this.data.elemento.id,
        nota: this.data.novaNota!,
        notaAnterior: this.data.notaAnterior!,
        motivacao: this.motivarNotaForm.get("motivation")?.value,
      })
      .subscribe({
        next: (res: any) => {
          const mensagem = `A nota foi atualizada com sucesso de ${this.data.notaAnterior} para ${this.data.novaNota}.`;
          this.data.notaAnterior = this.data.novaNota;
          this.motivarNotaForm.get("notaAnterior")?.setValue(this.data.novaNota);
          const cicloNode = this.data.ciclo;
          const pilarNode = this.data.pilar;
          const componenteNode = this.data.componente;
          const tipoNotaNode = this.data.tipoNota;
          const planoNode = this.data.plano;
          this.atualizarNotasViaTreeNodes(res, {
            ciclo: cicloNode,
            pilar: pilarNode,
            componente: componenteNode,
            plano: planoNode,
            tipoNota: tipoNotaNode,
          });
          this.data.notaAnterior = this.data.novaNota;
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

  private atualizarNotasViaTreeNodes(
    res: any,
    nodes: {
      ciclo: any;
      pilar: any;
      componente: any;
      plano: any;
      tipoNota: any;
    }
  ): void {
    const cicloNota = this.parseDecimal(res.cicloNota || "0");
    const pilarNota = this.parseDecimal(res.pilarNota || "0");
    const componenteNota = this.parseDecimal(res.componenteNota || "0");
    const planoNota = this.parseDecimal(res.planoNota || "0");
    const tipoNotaNota = this.parseDecimal(res.tipoNotaNota || "0");

    if (nodes.ciclo && !isNaN(cicloNota)) nodes.ciclo.grade = cicloNota;
    if (nodes.pilar && !isNaN(pilarNota)) nodes.pilar.grade = pilarNota;
    if (nodes.componente && !isNaN(componenteNota))
      nodes.componente.grade = componenteNota;
    if (nodes.plano && !isNaN(planoNota)) nodes.plano.grade = planoNota;
    if (nodes.tipoNota && !isNaN(tipoNotaNota))
      nodes.tipoNota.grade = tipoNotaNota;
  }

  private parseDecimal(valor: string | null | undefined): number {
    return parseFloat((valor || "0").replace(",", "."));
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
