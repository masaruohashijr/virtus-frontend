import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ProductElementHistoryDTO } from "src/app/domain/dto/product-element-history.dto";
import { ElementHistoryDetailsComponent } from "./element-history-details/element-history-details.component";

// Define TreeNode interface if not imported from elsewhere
interface TreeNode {
  data: any;
  parent?: TreeNode;
}

export interface ElementChangeHistoryData {
  entidade: { data: { name: string } }; // <- Agora você pode acessar entidade.name
  ciclo: { data: { name: string } };
  pilar: { data: { name: string } };
  componente: { data: { name: string } };
  plano: { data: { name: string } };
  tipoNota: { data: { name: string } };
  elemento: { data: { name: string } };
  historicoDataSource: ProductElementHistoryDTO[];
  motivacao?: string;
  metodo?:  string;
  peso?: number;
  nota?: number;
}

@Component({
  selector: "app-element-change-history.component",
  templateUrl: "./element-change-history.component.html",
  styleUrls: ["./element-change-history.component.css"],
})
export class ElementChangeHistoryComponent {
  texto: string = "";

  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<ElementChangeHistoryData>();
  displayedColumns: string[] = [
    "Autor",
    "Alteracao",
    "Em",
    "Peso",
    "Método",
    "Nota",    
    "Acoes",
  ];

  historicos = new MatTableDataSource<ProductElementHistoryDTO>([]);
  contador = 0;
  elementChangeHistoryForm!: FormGroup;

  ngOnInit(): void {
  }

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: ElementChangeHistoryData & {
      historico: ProductElementHistoryDTO[];
    },
    private dialog: MatDialog
  ) {
    this.elementChangeHistoryForm = this.formBuilder.group({
      entity: [this.data.entidade.data.name],
      cycle: [this.data.ciclo.data.name],
      pillar: [this.data.pilar.data.name],
      component: [this.data.componente.data.name],
      plan: [this.data.plano.data.name],
      gradeType: [this.data.tipoNota.data.name],
      element: [this.data.elemento.data.name],
      metodo: [this.data.metodo],
      weight: [this.data.peso],
      grade: [this.data.nota],
      motivation: [this.data.motivacao],
    });
    this.historicos.data = this.data.historicoDataSource || [];
  }

  getTitle() {
    return "Histórico do Elemento";
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
    this.dialog.open(ElementHistoryDetailsComponent, {
      width: "800px",
      data: row,
    });
  }

}

