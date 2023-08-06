import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComponentGradeType } from 'src/app/domain/dto/component-grade-type.dto';
import { ComponentDTO } from 'src/app/domain/dto/components.dto';
import { GradeTypeDTO } from 'src/app/domain/dto/type-of-note.dto';
import { GradeTypeService } from 'src/app/services/configuration/grade-type.service';

@Component({
  selector: 'app-components-grade-edit',
  templateUrl: './components-grade-edit.component.html',
  styleUrls: ['./components-grade-edit.component.css']
})
export class ComponentsGradeEditComponent implements OnInit {

  father: ComponentDTO
  object: ComponentGradeType;

  gradeTypes: GradeTypeDTO[] = []

  elementForm = this._formBuilder.group({
    gradeType: [this.data.object.gradeType, [Validators.required]],
    standardWeight: [this.data.object.standardWeight]
  });

  constructor(public dialogRef: MatDialogRef<ComponentsGradeEditComponent>,
    private _gradeTypeService: GradeTypeService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { father: ComponentDTO, object: ComponentGradeType }) {
    this.father = data.father;
    this.object = data.object;
  }

  ngOnInit(): void {
    this._gradeTypeService.getAll('', 0, 100).subscribe(resp => {
      this.gradeTypes = resp.content;
    });
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.gradeType = this.elementForm.value.gradeType;
    this.object.standardWeight = this.elementForm.value.standardWeight;

    this.dialogRef.close(this.object);
  }

  getTitle() {
    return this.object.gradeType?.name ? "Editar Nota \"" + this.object.gradeType?.name + "\"" : "Cadastrar nova Nota";
  }

}
