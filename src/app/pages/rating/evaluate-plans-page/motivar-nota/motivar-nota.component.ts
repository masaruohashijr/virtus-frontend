import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from "@angular/material/dialog";
import { EvaluatePlansService } from "src/app/services/rating/evaluate-plans.service";
import { MensagemDialogComponent } from "../mensagem/mensagem-dialog.component";

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
}
