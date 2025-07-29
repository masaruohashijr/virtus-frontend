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
  INICIA_EM = "I",
  TERMINA_EM = "T",
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
  iniciaEm: Date | null;
  terminaEm: Date | null;
  iniciaEmAnterior?: Date | null;
  terminaEmAnterior?: Date | null;
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
  @Output() onSave = new EventEmitter<void>();

  @ViewChild("motivationInput") motivationInput!: ElementRef;
  contador = 0;
  JustifyReschedulingForm!: FormGroup;
  entidade: any;
  ciclo: any;
  pilar: any;
  componente: any;
  texto: any;
  tipoData: any;
  rowNode: TreeNode | undefined;
  dataAnterior: string | undefined;
  novaData: string | undefined;

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
      tipoData: [{ value: this.data.tipoData, disabled: true }],
      iniciaEmAnterior: [
        {
          value: this.data.iniciaEmAnterior
            ? new Date(this.data.iniciaEmAnterior).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "",
          disabled: true,
        },
      ],
      terminaEmAnterior: [
        {
          value: this.data.terminaEmAnterior
            ? new Date(this.data.terminaEmAnterior).toLocaleDateString(
                "pt-BR",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }
              )
            : "",
          disabled: true,
        },
      ],
      iniciaEm: [
        {
          value: this.data.iniciaEm
            ? new Date(this.data.iniciaEm).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "",
          disabled: true,
        },
      ],
      terminaEm: [
        {
          value: this.data.terminaEm
            ? new Date(this.data.terminaEm).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
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

    if (this.data.tipoData === TipoData.INICIA_EM) {
      this.dataAnterior = this.data.iniciaEmAnterior
        ? new Date(this.data.iniciaEmAnterior).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "N/A";

      this.novaData = this.data.iniciaEm
        ? new Date(this.data.iniciaEm).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "N/A";
    } else {
      this.dataAnterior = this.data.terminaEmAnterior
        ? new Date(this.data.terminaEmAnterior).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "N/A";

      this.novaData = this.data.terminaEm
        ? new Date(this.data.terminaEm).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "N/A";
    }

    // ESC
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

    if (this.data.tipoData === "I") {
      tipo = "Inicial";
      dataAnterior = this.data.iniciaEmAnterior
        ? new Date(this.data.iniciaEmAnterior).toLocaleDateString("pt-BR")
        : "N/A";
      novaData = this.data.iniciaEm
        ? new Date(this.data.iniciaEm).toLocaleDateString("pt-BR")
        : "N/A";
    } else {
      tipo = "Final";
      dataAnterior = this.data.terminaEmAnterior
        ? new Date(this.data.terminaEmAnterior).toLocaleDateString("pt-BR")
        : "N/A";
      novaData = this.data.terminaEm
        ? new Date(this.data.terminaEm).toLocaleDateString("pt-BR")
        : "N/A";
    }
    return `Motivar a Reprogramação da Data ${tipo} de ${dataAnterior} para ${novaData}.`;
  }

  fechar() {
    this.onClose.emit();
    this.contador = 0;
    this.dialogRef.close();
  }

  salvar() {
    if (this.JustifyReschedulingForm.invalid) return;

    const body = {
      entidadeId: this.data.entidade?.data?.object?.id,
      cicloId: this.data.ciclo?.data?.object?.id,
      pilarId: this.data.pilar?.data?.object?.id,
      componenteId: this.data.componente?.data?.object?.component?.id,
      iniciaEm: this.data.iniciaEm,
      iniciaEmAnterior: this.data.iniciaEmAnterior,
      terminaEm: this.data.terminaEm,
      terminaEmAnterior: this.data.terminaEmAnterior,
      motivacao: this.JustifyReschedulingForm.get("motivation")?.value,
      tipoData: this.data.tipoData === "T" ? "T" : "I",
    };

    this._service.updateReschedullingComponent(body).subscribe({
      next: (res: any) => {
        const tipo = this.data.tipoData === "T" ? "Final" : "Inicial";

        let novaData: string = "N/A";

        if (this.data.tipoData === "T") {
          novaData = this.data.terminaEm
            ? new Date(this.data.terminaEm).toLocaleDateString("pt-BR")
            : "N/A";
        } else if (this.data.tipoData === "I") {
          novaData = this.data.iniciaEm
            ? new Date(this.data.iniciaEm).toLocaleDateString("pt-BR")
            : "N/A";
        }

        const mensagem = `A Data ${tipo} foi atualizada com sucesso de ${this.dataAnterior} para ${novaData}.`;

        this.dialog
          .open(PlainMessageDialogComponent, {
            width: "400px",
            data: { message: mensagem },
          })
          .afterClosed()
          .subscribe(() => {
            this.onSave.emit();
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
    }, 200);
    this.JustifyReschedulingForm.get("motivation")?.markAsUntouched();
  }
}
