import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CyclePillarDTO } from "src/app/domain/dto/cycle-pillar.dto";
import { CycleDTO } from "src/app/domain/dto/cycle.dto";
import { PillarDTO } from "src/app/domain/dto/pillar.dto";
import { BaseCrudEditComponent } from "src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component";
import { PillarsService } from "src/app/services/configuration/pillars.service";

@Component({
  selector: "app-cycles-pillars-edit",
  templateUrl: "./cycles-pillars-edit.component.html",
  styleUrls: ["./cycles-pillars-edit.component.css"],
})
export class CyclesPillarsEditComponent
  extends BaseCrudEditComponent<CyclePillarDTO>
  implements OnInit
{
  private father: CycleDTO;
  private object: CyclePillarDTO;

  pillars: PillarDTO[] = [];

  elementForm = this._formBuilder.group({
    pillar: [this.data.object.pillar, Validators.required],
    standardWeight: [0], 
    averageType: ["ARITHMETIC"]
  });

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<CyclesPillarsEditComponent>,
    private _pillarService: PillarsService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { father: CycleDTO; object: CyclePillarDTO }
  ) {
    super();
    this.father = data.father;
    this.object = data.object;
  }

  ngOnInit(): void {
    this._pillarService.getAll("", 0, 200).subscribe((resp) => {
      this.pillars = resp.content;
    });
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched();
      return;
    }
    this.object.pillar = this.elementForm.value.pillar;
    this.object.standardWeight = this.elementForm.value.standardWeight;
    this.object.averageType = {
      value: this.elementForm.value.averageType,
      description: this.elementForm.value.averageType,
    };
    this.dialogRef.close(this.object);
  }

  getTitle() {
    return this.object.pillar?.name
      ? 'Editar Pilar "' + this.object.pillar?.name + '"'
      : "Cadastrar novo Pilar";
  }
}
