import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ProductPlanHistoryDTO } from "src/app/domain/dto/product-plan-history.dto";
import { PlanHistoryDetailsComponent } from "./plan-history-details/plan-history-details.component";

export interface PlanChangeHistoryData {
  entidade: { data: { name: string } };
  ciclo: { data: { name: string } };
  pilar: { data: { name: string } };
  componente: { data: { name: string } };
  plano: { data: { name: string } };
  historicoDataSource: ProductPlanHistoryDTO[];
  peso: number | null;
  nota: number | null;
  metodo: string;
  motivacaoPeso?: string;
}

@Component({
  selector: "app-plan-change-history",
  templateUrl: "./plan-change-history.component.html",
  styleUrls: ["./plan-change-history.component.css"],
})
export class PlanChangeHistoryComponent {
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<PlanChangeHistoryData>();

  displayedColumns: string[] = [
    "Alteracao",
    "ValorDe",
    "ValorPara",
    "Autor",
    "Data",
    "Acoes",
  ];

  historicos = new MatTableDataSource<ProductPlanHistoryDTO>([]);
  planChangeHistoryForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: PlanChangeHistoryData,
    private dialog: MatDialog
  ) {
    this.planChangeHistoryForm = this.formBuilder.group({
      entity: [this.data.entidade.data.name],
      cycle: [this.data.ciclo.data.name],
      pillar: [this.data.pilar.data.name],
      component: [this.data.componente.data.name],
      plan: [this.data.plano.data.name],
      weight: [this.data.peso],
      grade: [this.data.nota],
      motivacao: [this.data.motivacaoPeso],
      metodo: [this.data.metodo],
    });

    this.historicos.data = this.formatarHistorico(
      this.data.historicoDataSource || []
    );
  }

  getTitle() {
    return "Histórico do Plano";
  }

  fechar() {
    this.onClose.emit();
  }

  showHistoryDetails(row: ProductPlanHistoryDTO) {
    this.dialog.open(PlanHistoryDetailsComponent, {
      width: "800px",
      data: row,
    });
  }

  private formatarHistorico(historico: ProductPlanHistoryDTO[]) {
    return historico.map((h) => {
      const dto = Object.setPrototypeOf(
        {
          ...h,
          alteracaoLabel: h.tipoAlteracao === "RE" ? "Retificação" : "Ratificação",
          valorDe: h.notaAnterior ?? "-",
          valorPara: h.nota ?? "-",
          alteradoEm: this.parseDate(h.alteradoEm),
        },
        Object.getPrototypeOf(h)
      );
      return dto;
    });
  }

  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const [d, m, yh] = dateStr.split("/");
    const [y, time] = [yh.slice(0, 4), yh.slice(5)];
    return new Date(`${y}-${m}-${d}T${time}`);
  }
}
