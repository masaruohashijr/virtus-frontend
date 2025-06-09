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
import { OnInit } from "@angular/core";
interface TreeNode {
  data: any;
  parent?: TreeNode;
}

export enum TipoData {
  Inicial = "Inicial",
  Final = "Final",
}

export interface JustifyReschedulingData {
  entidade: any;
  ciclo: any;
  pilar: any;
  componente: any;
  entidadeNome: string;
  cicloNome: string;
  pilarNome: string;
  componenteNome: string;
  dataInicialAnterior: Date | null;
  novaDataInicial: Date | null;
  dataFinalAnterior: Date | null;
  novaDataFinal: Date | null;
  texto: string;
  tipoData: TipoData;
}

@Component({
  selector: "app-justify-rescheduling",
  templateUrl: "./justify-rescheduling.component.html",
  styleUrls: ["./justify-rescheduling.component.css"],
})
export class JustifyReschedulingComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<JustifyReschedulingData>();

  @ViewChild("motivationInput") motivationInput!: ElementRef;
  contador = 0;
  JustifyReschedulingForm!: FormGroup;
  entidade: any;
  ciclo: any;
  pilar: any;
  componente: any;
  texto: any;
  rowNode: TreeNode | undefined;

  ngOnInit(): void {
    this.JustifyReschedulingForm = this.formBuilder.group({
      entidade: [{ value: this.data.entidade, disabled: true }],
      ciclo: [{ value: this.data.ciclo, disabled: true }],
      pilar: [{ value: this.data.pilar, disabled: true }],
      componente: [{ value: this.data.componente, disabled: true }],
      entidadeNome: [{ value: this.data.entidade.data.name, disabled: true }],
      cicloNome: [{ value: this.data.ciclo.data.name, disabled: true }],
      pilarNome: [{ value: this.data.pilar.data.name, disabled: true }],
      componenteNome: [
        { value: this.data.componente.data.name, disabled: true },
      ],
      dataInicialAnterior: [
        {
          value: this.data.dataInicialAnterior
            ? new Date(this.data.dataInicialAnterior).toLocaleDateString(
                "pt-BR"
              )
            : "",
          disabled: true,
        },
      ],
      novaDataInicial: [
        {
          value: this.data.novaDataInicial
            ? new Date(this.data.novaDataInicial).toLocaleDateString("pt-BR")
            : "",
          disabled: true,
        },
      ],
      dataFinalAnterior: [
        {
          value: this.data.dataFinalAnterior
            ? new Date(this.data.dataFinalAnterior).toLocaleDateString("pt-BR")
            : "",
          disabled: true,
        },
      ],
      novaDataFinal: [
        {
          value: this.data.novaDataFinal
            ? new Date(this.data.novaDataFinal).toLocaleDateString("pt-BR")
            : "",
          disabled: true,
        },
      ],
      motivation: [
        this.data.texto || "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(400),
        ],
      ],
    });

    // ESC listener
    this.dialogRef.keydownEvents().subscribe((event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Esc") {
        this.fechar();
      }
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<JustifyReschedulingData>,
    @Inject(MAT_DIALOG_DATA) public data: JustifyReschedulingData,
    private _service: DistributeActivitiesService
  ) {}

  getTitle() {
    let tipo: string;
    let dataAnterior: string;
    let novaData: string;

    if (this.data.tipoData === "Inicial") {
      tipo = "Inicial";
      dataAnterior = this.data.dataInicialAnterior
        ? new Date(this.data.dataInicialAnterior).toLocaleDateString("pt-BR")
        : "";
      novaData = this.data.novaDataInicial
        ? new Date(this.data.novaDataInicial).toLocaleDateString("pt-BR")
        : "";
    } else {
      tipo = "Final";
      dataAnterior = this.data.dataFinalAnterior
        ? new Date(this.data.dataFinalAnterior).toLocaleDateString("pt-BR")
        : "";
      novaData = this.data.novaDataFinal
        ? new Date(this.data.novaDataFinal).toLocaleDateString("pt-BR")
        : "";
    }
    return `Motivar a Reprogramação da Data ${tipo} de ${dataAnterior} para ${novaData}.`;
  }

  fechar() {
    this.onClose.emit();
    this.contador = 0;
  }

  salvar() {
    if (this.JustifyReschedulingForm.invalid) return;

    const body = {
      entidadeId: this.data.entidade,
      cicloId: this.data.ciclo.data.object.id,
      pilarId: this.data.pilar.data.object.id,
      componenteId: this.data.componente.data.object.component.id,
      novaDataInicial: this.data.novaDataInicial,
      dataInicialAnterior: this.data.dataInicialAnterior,
      novaDataFinal: this.data.novaDataFinal,
      dataFinalAnterior: this.data.dataFinalAnterior,
      motivacao: this.JustifyReschedulingForm.get("motivation")?.value,
    };

    this._service.updateReschedullingComponent(body).subscribe({
      next: (res: any) => {
        const tipo = this.data.tipoData === "Final" ? "Final" : "Inicial";

        const dataAnterior = this.data.dataInicialAnterior
          ? new Date(this.data.dataInicialAnterior).toLocaleDateString("pt-BR")
          : "N/A";

        const novaData = this.data.novaDataInicial
          ? new Date(this.data.novaDataInicial).toLocaleDateString("pt-BR")
          : "N/A";

        const mensagem = `A Data ${tipo} foi atualizada com sucesso de ${dataAnterior} para ${novaData}.`;

        this.dialog
          .open(PlainMessageDialogComponent, {
            width: "400px",
            data: { message: mensagem },
          })
          .afterClosed()
          .subscribe(() => {
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
      this.motivationInput?.nativeElement?.focus({ preventScroll: true });
    }, 100);
    this.JustifyReschedulingForm.get("motivation")?.markAsUntouched();
  }
}
