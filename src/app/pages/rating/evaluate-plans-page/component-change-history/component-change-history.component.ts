import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ProductComponentHistoryDTO } from "src/app/domain/dto/product-component-history.dto";
import { ComponentHistoryDetailsComponent } from "./component-history-details/component-history-details.component";

// Define TreeNode interface if not imported from elsewhere
interface TreeNode {
  data: any;
  parent?: TreeNode;
}

export interface ComponentChangeHistoryData {
  entidade: { data: { name: string } }; // <- Agora você pode acessar entidade.name
  ciclo: { data: { name: string } };
  pilar: { data: { name: string } };
  componente: { data: { name: string } };
  historicoDataSource: ProductComponentHistoryDTO[];
  motivacao?: string;
  peso?: number;
  nota?: number;
}

@Component({
  selector: "app-component-change-history.component",
  templateUrl: "./component-change-history.component.html",
  styleUrls: ["./component-change-history.component.css"],
})
export class ComponentChangeHistoryComponent {
  texto: string = "";

  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<ComponentChangeHistoryData>();
  displayedColumns: string[] = [
    "Alteracao",
    "ValorDe",
    "ValorPara",
    "Autor",
    "Data",
    "Acoes",
  ];

  historicos = new MatTableDataSource<ProductComponentHistoryDTO>([]);
  contador = 0;
  componentChangeHistoryForm!: FormGroup;

  ngOnInit(): void {
    this.prepareHistoryData();
  }


  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: ComponentChangeHistoryData & {
      historico: ProductComponentHistoryDTO[];
    },
    private dialog: MatDialog
  ) {
    this.componentChangeHistoryForm = this.formBuilder.group({
      entity: [this.data.entidade.data.name],
      cycle: [this.data.ciclo.data.name],
      pillar: [this.data.pilar.data.name],
      component: [this.data.componente.data.name],
      weight: [this.data.peso],
      grade: [this.data.nota],
      motivation: [this.data.motivacao],
    });
    this.historicos.data = this.data.historicoDataSource || [];
  }

  getTitle() {
    return "Histórico do Componente";
  }

  fechar() {
    this.onClose.emit();
    this.contador = 0;
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

  showHistoryDetails(row: any) {
    this.dialog.open(ComponentHistoryDetailsComponent, {
      width: "800px",
      data: row,
    });
  }

  prepareHistoryData(): void {
    this.historicos.data = (this.data.historicoDataSource || []).map((row) => {
      let alteracao = "";
      let de = "";
      let para = "";

      switch (row.tipoAlteracao) {
        case "P":
          alteracao = "Planos";
          de = row.configAnterior || "Vazio";
          para = row.config;
          break;
        case "R":
          alteracao = "Auditor";
          de = row.auditorAnteriorName || "—";
          para = row.auditorName || "—";
          break;
        case "I":
          alteracao = "Inicia Em";
          de = row.iniciaEmAnterior || "—";
          para = row.iniciaEm || "—";
          break;
        case "T":
          alteracao = "Termina Em";
          de = row.terminaEmAnterior || "—";
          para = row.terminaEm || "—";
          break;
        default:
          alteracao = "Nota";
          de = row.configAnterior || "Vazio";
          para = row.config;
      }

      // Create a new instance of ProductComponentHistoryDTO and assign extra properties
      const dto = Object.assign(
        Object.create(Object.getPrototypeOf(row)),
        row,
        {
          alteracaoLabel: alteracao,
          valorDe: de,
          valorPara: para,
        }
      );
      return dto;
    });
  }
}
