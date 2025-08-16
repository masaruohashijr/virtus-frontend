import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EntityVirtusDTO } from "src/app/domain/dto/entity-virtus.dto";
import { PlanDTO } from "src/app/domain/dto/plan.dto";
import { BaseCrudEditComponent } from "src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component";

@Component({
  selector: "app-plans-edit",
  templateUrl: "./plans-edit.component.html",
  styleUrls: ["./plans-edit.component.css"],
})
export class PlansEditComponent
  extends BaseCrudEditComponent<PlanDTO>
  implements OnInit
{
  private father: EntityVirtusDTO;
  private object: PlanDTO;
  contador = 0;
  errorMessage: string = "";

  planForm = this._formBuilder.group({
    cnpb: [this.data.object.cnpb, [Validators.required]],
    name: [this.data.object.name],
    modality: [this.data.object.modality, [Validators.required]],
    guaranteeResource: [
      this.data.object.guaranteeResource,
      [Validators.required],
    ],
    description: [this.data.object.description],
  });

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<PlansEditComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { father: EntityVirtusDTO; object: PlanDTO }
  ) {
    super();
    this.father = data.father;
    this.object = data.object;
  }

  ngOnInit(): void {
    this.atualizarContador();
    this.planForm
      .get("description")
      ?.valueChanges.subscribe((val: string | null | undefined) => {
        this.contador = val?.length || 0;

        if (this.contador > 8000) {
          this.errorMessage = "Limite de 8000 caracteres atingido.";
          const truncated = (val ?? "").substring(0, 8000);
          this.planForm
            .get("description")
            ?.setValue(truncated, { emitEvent: false });
          this.contador = 8000;
        } else if (this.contador < 4 && this.contador >= 0) {
          this.errorMessage =
            "A descrição deve conter entre 4 e 8000 caracteres.";
        } else {
          this.errorMessage = "";
        }
      });
  }

  atualizarContador() {
    const descValue = this.planForm.get("description")?.value ?? "";
    this.contador = descValue.length;
  }

  save() {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      return;
    }

    this.object.cnpb = this.planForm.value.cnpb;
    this.object.name = this.planForm.value.name;
    this.object.modality = this.planForm.value.modality;
    this.object.guaranteeResource = this.planForm.value.guaranteeResource;
    this.object.description = this.planForm.value.description;
    this.dialogRef.close(this.object);
  }

  getTitle() {
    return this.object?.cnpb
      ? 'Editar Plano "' + this.object.cnpb + '"'
      : "Cadastrar novo Plano";
  }
}
