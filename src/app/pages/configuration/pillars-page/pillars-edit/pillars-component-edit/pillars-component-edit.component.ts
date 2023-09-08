import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComponentDTO } from 'src/app/domain/dto/components.dto';
import { PillarComponentDTO } from 'src/app/domain/dto/pillar-component.dto';
import { PillarDTO } from 'src/app/domain/dto/pillar.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { ComponentsService } from 'src/app/services/configuration/components.service';

@Component({
  selector: 'app-pillars-component-edit',
  templateUrl: './pillars-component-edit.component.html',
  styleUrls: ['./pillars-component-edit.component.css']
})
export class PillarsComponentEditComponent extends BaseCrudEditComponent<PillarComponentDTO> implements OnInit {

  private father: PillarDTO
  private object: PillarComponentDTO

  components: ComponentDTO[] = []

  elementForm = this._formBuilder.group({
    component: [this.data.object.component, [Validators.required]],
    standardWeight: [this.data.object.standardWeight, [Validators.required]],
    averageType: [this.data.object.averageType?.value, [Validators.required]],
    probeFile: [this.data.object.probeFile,]
  });

  constructor(public dialogRef: MatDialogRef<PillarsComponentEditComponent>,
    private _componenteService: ComponentsService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { father: PillarDTO, object: PillarComponentDTO }) {
    super();
    this.father = data.father;
    this.object = data.object;
    console.log(this.father)
  }

  ngOnInit(): void {
    this._componenteService.getAll('', 0, 200).subscribe(resp => {
      this.components = resp.content;
    })
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.component = this.elementForm.value.component;
    this.object.standardWeight = this.elementForm.value.standardWeight;
    this.object.averageType = { value: this.elementForm.value.averageType, description: this.elementForm.value.averageType };
    this.object.probeFile = this.elementForm.value.probeFile?.toString();
    this.dialogRef.close(this.object);
  }

  getTitle() {
    return this.object.component?.name ? "Editar Componente \"" + this.object.component?.name + "\"" : "Cadastrar novo Componente";
  }

}
