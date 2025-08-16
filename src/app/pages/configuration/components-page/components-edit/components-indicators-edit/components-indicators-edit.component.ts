import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ComponentIndicatorDTO } from "src/app/domain/dto/component-indicator.dto";
import { ComponentDTO } from "src/app/domain/dto/components.dto";
import { IndicatorDTO } from "src/app/domain/dto/indicator.dto";
import { IndicatorsService } from "src/app/services/configuration/indicators.service";

@Component({
  selector: "app-components-indicator-edit",
  templateUrl: "./components-indicators-edit.component.html",
  styleUrls: ["./components-indicators-edit.component.css"],
})
export class ComponentsIndicatorsEditComponent implements OnInit {
  father: ComponentDTO;
  object: ComponentIndicatorDTO;
  allIndicators: IndicatorDTO[] = [];

  indicatorForm = this._formBuilder.group({
    indicator: [null as IndicatorDTO | null, [Validators.required]],
    standardWeight: [1, [Validators.required, Validators.min(0)]],
  });

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<ComponentsIndicatorsEditComponent>,
    private _indicatorService: IndicatorsService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { father: ComponentDTO; object: ComponentIndicatorDTO }
  ) {
    this.father = data.father;
    this.object = data.object ?? new ComponentIndicatorDTO();

    // preenche o formulário se o objeto já existir
    if (this.object.indicator) {
      this.indicatorForm.patchValue({
        indicator: this.object.indicator,
        standardWeight: this.object.standardWeight ?? 1,
      });
    }
  }

  ngOnInit(): void {
    this._indicatorService
      .getAll("", 0, 100)
      .subscribe((resp: { content: IndicatorDTO[] }) => {
        this.allIndicators = resp.content.sort((a, b) =>
          (a.indicatorAcronym ?? '').localeCompare(b.indicatorAcronym ?? '')
        );
      });
  }

  save(): void {
    if (this.indicatorForm.invalid) {
      this.indicatorForm.markAllAsTouched();
      return;
    }

    const selectedIndicator =
      this.indicatorForm.value.indicator ?? new IndicatorDTO();
    const weight = this.indicatorForm.value.standardWeight ?? 1;

    this.object.indicator = selectedIndicator;
    this.object.standardWeight = weight;

    this.dialogRef.close(this.object);
  }

  getTitle(): string {
    return this.object?.indicator?.indicatorName
      ? `Reconfigurar Indicador "${this.object.indicator.indicatorName}"`
      : "Configurar novo Indicador";
  }

  compare = (a: IndicatorDTO, b: IndicatorDTO) => a && b && a.id === b.id;
}
