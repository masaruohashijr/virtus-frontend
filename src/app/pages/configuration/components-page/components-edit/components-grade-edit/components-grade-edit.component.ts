import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComponentGradeType } from 'src/app/domain/dto/component-grade-type.dto';
import { ComponentDTO } from 'src/app/domain/dto/components.dto';
import { GradeTypeDTO } from 'src/app/domain/dto/type-of-note.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { GradeTypeService } from 'src/app/services/configuration/grade-type.service';

@Component({
  selector: 'app-components-grade-edit',
  templateUrl: './components-grade-edit.component.html',
  styleUrls: ['./components-grade-edit.component.css']
})
export class ComponentsGradeEditComponent extends BaseCrudEditComponent<ComponentGradeType> implements OnInit {

  father: ComponentDTO
  object: ComponentGradeType;

  gradeTypes: GradeTypeDTO[] = []

  gradeTypeForm = this._formBuilder.group({
    gradeType: [this.data.object.gradeType, [Validators.required]],
    standardWeight: [this.data.object.standardWeight]
  });

  constructor(public dialogRef: MatDialogRef<ComponentsGradeEditComponent>,
    private _gradeTypeService: GradeTypeService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { father: ComponentDTO, object: ComponentGradeType }) {
    super();
    this.father = data.father;
    this.object = data.object;
  }

  ngOnInit(): void {
    this._gradeTypeService.getAll('', 0, 100).subscribe(resp => {
      this.gradeTypes = resp.content;
    });
  }

  save() {
    if (this.gradeTypeForm.invalid) {
      this.gradeTypeForm.markAllAsTouched()
      return;
    }

    this.object.gradeType = this.gradeTypeForm.value.gradeType;
    this.object.standardWeight = this.gradeTypeForm.value.standardWeight;

    this.dialogRef.close(this.object);
  }

  getTitle() {
    return this.object.gradeType?.name ? "Reconfigurar Tipo de Nota \"" + this.object.gradeType?.name + "\"" : "Configurar novo Tipo de Nota";
  }

}
