import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EvaluatePlansService } from "src/app/services/rating/evaluate-plans.service";

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
    public dialogRef: MatDialogRef<MotivarNotaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MotivarNotaComponent,
    private evaluatePlansService: EvaluatePlansService
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
      motivation: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(400)]],
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
        motivacao: this.motivarNotaForm.get("motivation")?.value,
      })
      .subscribe({
        next: () => this.dialogRef.close({ sucesso: true }),
        error: (err) => console.error("Erro ao salvar nota:", err),
      });
  }

  atualizarContador() {
    this.contador = this.data.texto?.length || 0;
  }
}
