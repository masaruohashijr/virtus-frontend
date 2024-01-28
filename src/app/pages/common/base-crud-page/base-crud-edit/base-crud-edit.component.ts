import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/dialog/alert-dialog/alert-dialog.component';
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

  mostrarErro(error: any, errorDialog: MatDialog) {
    const errorDialogRef = errorDialog.open(AlertDialogComponent, {
      width: '350px',
      data: {
        title: "Erro",
        message: error.error?.message ? error.error?.message : "Erro interno no servidor."
      },
    });

    errorDialogRef.afterClosed().subscribe(result => {

    });
  }

}
