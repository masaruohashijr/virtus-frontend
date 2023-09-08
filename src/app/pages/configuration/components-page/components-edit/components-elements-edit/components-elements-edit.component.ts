import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComponentElementDTO } from 'src/app/domain/dto/component-element.dto';
import { ComponentDTO } from 'src/app/domain/dto/components.dto';
import { ElementDTO } from 'src/app/domain/dto/element.dto';
import { GradeTypeDTO } from 'src/app/domain/dto/type-of-note.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { ElementsService } from 'src/app/services/configuration/elements.service';
import { GradeTypeService } from 'src/app/services/configuration/grade-type.service';

@Component({
  selector: 'app-components-elements-edit',
  templateUrl: './components-elements-edit.component.html',
  styleUrls: ['./components-elements-edit.component.css']
})
export class ComponentsElementsEditComponent extends BaseCrudEditComponent<ComponentDTO> implements OnInit {

  father: ComponentDTO
  object: ComponentElementDTO;

  gradeTypes: GradeTypeDTO[] = []
  elements: ElementDTO[] = []

  elementForm = this._formBuilder.group({
    element: [this.data.object.element, [Validators.required]],
    gradeType: [this.data.object.gradeType, [Validators.required]],
    standardWeight: [this.data.object.standardWeight]
  });

  constructor(public dialogRef: MatDialogRef<ComponentsElementsEditComponent>,
    private _gradeTypeService: GradeTypeService,
    private _elementsService: ElementsService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { father: ComponentDTO, object: ComponentElementDTO }) {
    super();
    this.father = data.father;
    this.object = data.object;
  }

  ngOnInit(): void {
    this._gradeTypeService.getAll('', 0, 100).subscribe(resp => {
      this.gradeTypes = resp.content;
    });
    this._elementsService.getAll('', 0, 100).subscribe(resp => {
      this.elements = resp.content;
    });
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.element = this.elementForm.value.element;
    this.object.gradeType = this.elementForm.value.gradeType;
    this.object.standardWeight = this.elementForm.value.standardWeight;

    this.dialogRef.close(this.object);
  }

  getTitle() {
    return this.object.gradeType?.name ? "Editar Elemento \"" + this.object.element?.name + "\"" : "Cadastrar novo Elemento";
  }

}
