import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ElementItemDTO } from 'src/app/domain/dto/element-item.dto';
import { ElementDTO } from 'src/app/domain/dto/element.dto';

@Component({
  selector: 'app-elements-item-edit',
  templateUrl: './elements-item-edit.component.html',
  styleUrls: ['./elements-item-edit.component.css']
})
export class ElementsItemEditComponent implements OnInit {

  private father: ElementDTO
  private object: ElementItemDTO

  elementForm = this._formBuilder.group({
    name: [this.data.object.name, [Validators.required]],
    description: [this.data.object.description],
    reference: [this.data.object.reference],
  });

  constructor(public dialogRef: MatDialogRef<ElementsItemEditComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { father: ElementDTO, object: ElementItemDTO }) {
    this.father = data.father;
    this.object = data.object;
    console.log(this.father)
  }

  ngOnInit(): void {
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.name = this.elementForm.value.name?.toString();
    this.object.description = this.elementForm.value.description?.toString();
    this.object.reference = this.elementForm.value.reference?.toString();

    this.dialogRef.close(this.object);
  }

  getTitle() {
    return this.object.name ? "Editar Item \"" + this.object.name + "\"" : "Cadastrar novo Item";
  }

}
