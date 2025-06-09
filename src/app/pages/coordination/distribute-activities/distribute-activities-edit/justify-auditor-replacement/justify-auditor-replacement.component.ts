import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { PlainMessageDialogComponent } from "src/app/pages/administration/plain-message/plain-message-dialog.component";
import { DistributeActivitiesService } from "src/app/services/coordination/distribute-activities.service";

// Define TreeNode interface if not imported from elsewhere
interface TreeNode {
  data: any;
  parent?: TreeNode;
}

export interface JustifyAuditorReplacementData {
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
  selector: "app-justify-auditor-replacement",
  templateUrl: "./justify-auditor-replacement.component.html",
  styleUrls: ["./justify-auditor-replacement.component.css"],
})
export class JustifyAuditorReplacementComponent {
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<JustifyAuditorReplacementData>();

  @ViewChild("motivationInput") motivationInput!: ElementRef;
  contador = 0;
  justifyAuditorReplacementForm!: FormGroup;
  entidade: any;
  ciclo: any;
  pilar: any;
  componente: any;
  novoAuditor: any;
  auditorAnterior: any;
  texto: any;
  rowNode: TreeNode | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<JustifyAuditorReplacementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: JustifyAuditorReplacementComponent,
    private _service: DistributeActivitiesService
  ) {
    this.justifyAuditorReplacementForm = this.formBuilder.group({
      entity: [this.data.entidade.data.name],
      cycle: [this.data.ciclo.data.name],
      pillar: [this.data.pilar.data.name],
      component: [this.data.componente.data.name],
      novoAuditor: [this.data.novoAuditor.name],
      auditorAnterior: [this.data.auditorAnterior.name],
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
    return (
      "Motivar a Substituição do Auditor " + this.data.auditorAnterior.name
    );
  }

  fechar() {
    this.onClose.emit();
    this.contador = 0;
  }

  salvar() {
    if (this.justifyAuditorReplacementForm.invalid) return;

    const motivacao =
      this.justifyAuditorReplacementForm.get("motivation")?.value;

    const body = {
      entidadeId: this.data.entidade.data.object.id,
      cicloId: this.data.ciclo.data.object.id,
      pilarId: this.data.pilar.data.object.id,
      componenteId: this.data.componente.data.object.component.id,
      novoAuditorId: this.data.novoAuditor.userId,
      auditorAnteriorId: this.data.auditorAnterior.userId,
      motivacao: this.justifyAuditorReplacementForm.get("motivation")?.value,
    };

    this._service.updateNewAuditorComponent(body).subscribe({
      next: (res: any) => {
        const mensagem = `O auditor foi atualizado com sucesso de ${this.data.auditorAnterior.name} para ${this.data.novoAuditor.name}.`;

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
      error: (err: any) => console.error("Erro ao salvar:", err),
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

  ngAfterViewInit() {
    setTimeout(() => {
      this.motivationInput.nativeElement.focus();
    }, 0);
  }
}
