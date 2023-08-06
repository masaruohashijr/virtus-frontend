import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseDTO } from 'src/app/domain/common/base.dto';

@Component({
  selector: 'app-base-crud-edit',
  templateUrl: './base-crud-edit.component.html',
  styleUrls: ['./base-crud-edit.component.css']
})
export abstract class BaseCrudEditComponent<T extends BaseDTO> implements OnInit {

  constructor(public dialogRef: MatDialogRef<BaseCrudEditComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public object: T) { }

  ngOnInit(): void {
  }

  getTitle() {
    return this.getNameToTitle() ? "Editar Tipo de Nota \"" + this.getNameToTitle() + "\"" : "Cadastrar novo Tipo de Nota";
  }

  abstract getNameToTitle(): string;

  getObject() {
    return this.object;
  }

}
