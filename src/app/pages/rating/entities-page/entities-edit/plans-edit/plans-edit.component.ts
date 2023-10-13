import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';
import { PlanDTO } from 'src/app/domain/dto/plan.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';

@Component({
  selector: 'app-plans-edit',
  templateUrl: './plans-edit.component.html',
  styleUrls: ['./plans-edit.component.css']
})
export class PlansEditComponent extends BaseCrudEditComponent<PlanDTO> implements OnInit {

  private father: EntityVirtusDTO
  private object: PlanDTO

  elementForm = this._formBuilder.group({
    cnpb: [this.data.object.cnpb, [Validators.required]],
    name: [this.data.object.name],
    modality: [this.data.object.modality, [Validators.required]],
    guaranteeResource: [this.data.object.guaranteeResource, [Validators.required]],
    description: [this.data.object.description]
  });

  constructor(public dialogRef: MatDialogRef<PlansEditComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { father: EntityVirtusDTO, object: PlanDTO }) {
    super();
    this.father = data.father;
    this.object = data.object;
  }

  ngOnInit(): void {
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.cnpb = this.elementForm.value.cnpb;
    this.object.name = this.elementForm.value.name;
    this.object.modality = this.elementForm.value.modality;
    this.object.guaranteeResource = this.elementForm.value.guaranteeResource;
    this.object.description = this.elementForm.value.description;
    this.dialogRef.close(this.object);
  }

  getTitle() {
    return this.object?.cnpb ? "Editar Ciclo \"" + this.object.cnpb + "\"" : "Cadastrar novo Ciclo";
  }

}
