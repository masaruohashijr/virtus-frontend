import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseDTO } from 'src/app/domain/common/base.dto';

@Component({
  selector: 'app-base-crud-edit',
  templateUrl: './base-crud-edit.component.html',
  styleUrls: ['./base-crud-edit.component.css']
})
export class BaseCrudEditComponent<T extends BaseDTO> {

  compare(object1: BaseDTO, object2: BaseDTO) {
    return object1 && object2 ? object1.id === object2.id : object1 === object2
  }

}
