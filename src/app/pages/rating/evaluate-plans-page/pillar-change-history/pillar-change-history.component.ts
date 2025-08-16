import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ProductPillarHistoryDTO } from "src/app/domain/dto/product-pillar-history.dto";
import { PillarHistoryDetailsComponent } from "./pillar-history-details/pillar-history-details.component";

export interface PillarChangeHistoryData {
  entidade: { data: { name: string } };
  ciclo: { data: { name: string } };
  pilar: { data: { name: string } };
  historicoDataSource: ProductPillarHistoryDTO[];
  peso: number | null;
  nota: number | null;
  metodo: string;
  motivacaoPeso?: string;
}

@Component({
  selector: "app-pillar-change-history",
  templateUrl: "./pillar-change-history.component.html",
  styleUrls: ["./pillar-change-history.component.css"],
})
export class PillarChangeHistoryComponent {
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<PillarChangeHistoryData>();

  displayedColumns: string[] = [
    "Alteracao",
    "ValorDe",
    "ValorPara",
    "Autor",
    "Data",
    "Acoes",
  ];

  historicos = new MatTableDataSource<ProductPillarHistoryDTO>([]);
  pillarChangeHistoryForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: PillarChangeHistoryData,
    @Inject(MatDialog) private dialog: MatDialog
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

    this.historicos.data = this.formatarHistorico(
      this.data.historicoDataSource || []
    );
  }

  getTitle() {
    return "Histórico do Pilar";
  }

  fechar() {
    this.onClose.emit();
  }

  showHistoryDetails(row: ProductPillarHistoryDTO) {
    this.dialog.open(PillarHistoryDetailsComponent, {
      width: "800px",
      data: row,
    });
  }

  private formatarHistorico(historico: ProductPillarHistoryDTO[]) {
    return historico.map((h) => {
      const dto = Object.setPrototypeOf(
        {
          ...h,
          alteracaoLabel: h.tipoAlteracao === "P" ? "Peso" : "Nota",
          valorDe:
            h.tipoAlteracao === "P"
              ? h.pesoAnterior ?? "-"
              : h.notaAnterior ?? "-",
          valorPara: h.tipoAlteracao === "P" ? h.peso ?? "-" : h.nota ?? "-",
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
