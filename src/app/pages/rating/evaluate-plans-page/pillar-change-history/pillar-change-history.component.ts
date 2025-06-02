import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ProductPillarHistoryDTO } from "src/app/domain/dto/product-pillar-history.dto";
import { PillarHistoryDetailsComponent } from "../pillar-history-details/pillar-history-details.component";

// Define TreeNode interface if not imported from elsewhere
interface TreeNode {
  data: any;
  parent?: TreeNode;
}

export interface PillarChangeHistoryData {
  entidade: { data: { name: string } }; // <- Agora você pode acessar entidade.name
  ciclo: { data: { name: string } };
  pilar: { data: { name: string } };
  historicoDataSource: ProductPillarHistoryDTO[];
  peso: number | null;
  nota: number | null;
  metodo: string;
  motivacaoPeso?: string; // Added missing property
}

@Component({
  selector: "app-pillar-change-history.component",
  templateUrl: "./pillar-change-history.component.html",
  styleUrls: ["./pillar-change-history.component.css"],
})
export class PillarChangeHistoryComponent {
  texto: string = "";

  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<PillarChangeHistoryData>();
  displayedColumns: string[] = [
    "tipoAlteracao",
    "nota",
    "metodo",
    "peso",
    "autor",
    "data",
    "acoes",
  ];

  historicos = new MatTableDataSource<ProductPillarHistoryDTO>([]);
  contador = 0;
  pillarChangeHistoryForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: PillarChangeHistoryData & {
      historico: ProductPillarHistoryDTO[];
    },
    private dialog: MatDialog
  ) {
    this.pillarChangeHistoryForm = this.formBuilder.group({
      entity: [this.data.entidade.data.name],
      cycle: [this.data.ciclo.data.name],
      pillar: [this.data.pilar.data.name],
      weight: [this.data.peso],
      grade: [this.data.nota],
      motivacao: [this.data.motivacaoPeso],
      metodo: [this.data.metodo],
    });
    this.historicos.data = this.data.historicoDataSource || [];
  }

  getTitle() {
    return "Histórico do Pilar";
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
    this.dialog.open(PillarHistoryDetailsComponent, {
      width: "800px",
      data: row,
    });
  }
}
