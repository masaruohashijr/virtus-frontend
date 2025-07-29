import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ProductElementHistoryDTO } from "src/app/domain/dto/product-element-history.dto";
import { ElementHistoryDetailsComponent } from "./element-history-details/element-history-details.component";

interface TreeNode {
  data: any;
  parent?: TreeNode;
}

export interface ElementChangeHistoryData {
  entidade: { data: { name: string } };
  ciclo: { data: { name: string } };
  pilar: { data: { name: string } };
  componente: { data: { name: string } };
  plano: { data: { name: string } };
  tipoNota: { data: { name: string } };
  elemento: { data: { name: string } };
  historicoDataSource: ProductElementHistoryDTO[];
  motivacao?: string;
  peso?: number;
  nota?: number;
}

@Component({
  selector: "app-element-change-history",
  templateUrl: "./element-change-history.component.html",
  styleUrls: ["./element-change-history.component.css"],
})
export class ElementChangeHistoryComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<ElementChangeHistoryData>();

  displayedColumns: string[] = [
    "Alteracao",
    "ValorDe",
    "ValorPara",
    "Autor",
    "Data",
    "Acoes",
  ];

  historicos = new MatTableDataSource<ProductElementHistoryDTO>([]);
  elementChangeHistoryForm!: FormGroup;
  contador = 0;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: ElementChangeHistoryData & { historico: ProductElementHistoryDTO[] },
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.elementChangeHistoryForm = this.formBuilder.group({
      entity: [this.data.entidade.data.name],
      cycle: [this.data.ciclo.data.name],
      pillar: [this.data.pilar.data.name],
      component: [this.data.componente.data.name],
      plan: [this.data.plano.data.name],
      gradeType: [this.data.tipoNota.data.name],
      element: [this.data.elemento.data.name],
      weight: [this.data.peso ?? null],
      grade: [this.data.nota ?? null],
      motivation: [this.data.motivacao ?? ""],
    });

    this.historicos.data = this.formatarHistorico(this.data.historicoDataSource || []);
  }

  fechar() {
    this.onClose.emit();
  }

  showHistoryDetails(row: ProductElementHistoryDTO) {
    this.dialog.open(ElementHistoryDetailsComponent, {
      width: "800px",
      data: row,
    });
  }

  private formatarHistorico(historico: ProductElementHistoryDTO[]): ProductElementHistoryDTO[] {
    return historico.map((h) => {
      const dto = Object.assign(
        Object.create(Object.getPrototypeOf(h)),
        h
      );
      dto.alteracaoLabel = h.tipoAlteracao === "P" ? "Peso" : "Nota";
      dto.valorDe = h.tipoAlteracao === "P" ? h.pesoAnterior : h.notaAnterior;
      dto.valorPara = h.tipoAlteracao === "P" ? h.peso : h.nota;
      dto.alteradoEm = h.alteradoEm ? this.stringToDate(h.alteradoEm) : null;
      return dto;
    });
  }

  private stringToDate(dateStr: string): Date | null {
    const [datePart, timePart] = dateStr.split(" ");
    if (!datePart || !timePart) return null;

    const [day, month, year] = datePart.split("/");
    const [hour, minute, second] = timePart.split(":");

    return new Date(+year, +month - 1, +day, +hour, +minute, +second);
  }
}
