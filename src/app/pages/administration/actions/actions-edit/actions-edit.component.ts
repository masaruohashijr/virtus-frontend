import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { tap } from 'rxjs/internal/operators/tap';
import { BaseDTO } from 'src/app/domain/common/base.dto';
import { ActionDTO } from 'src/app/domain/dto/action.dto';
import { StatusDTO } from 'src/app/domain/dto/status.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { ActionsService } from 'src/app/services/administration/actions.service';
import { StatusService } from 'src/app/services/administration/status.service';

@Component({
  selector: 'app-actions-edit',
  templateUrl: './actions-edit.component.html',
  styleUrls: ['./actions-edit.component.css']
})
export class ActionsEditComponent extends BaseCrudEditComponent<ActionDTO> implements OnInit{

  elementForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    otherThan: [this.object.otherThan],
    originStatus: [this.object.originStatus, [Validators.required]],
    destinationStatus: [this.object.destinationStatus, [Validators.required]],
    description: [this.object.description]
  });

  allStatus: StatusDTO[] = [];

  constructor(public dialogRef: MatDialogRef<ActionsEditComponent>,
    private _formBuilder: FormBuilder,
    private _service: ActionsService,
    private _statusService: StatusService,
    @Inject(MAT_DIALOG_DATA) public object: ActionDTO) {
    super();
  }

  ngOnInit(): void {
    this._statusService.getAll('', 0, 1000).subscribe(resp => {
      this.allStatus = resp.content;
    });
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.name = this.elementForm.value.name?.toString();
    this.object.description = this.elementForm.value.description?.toString();
    this.object.otherThan = this.elementForm.value.otherThan?.valueOf() ? true : false;
    this.object.idOriginStatus = this.elementForm.value.originStatus?.id;
    this.object.idDestinationStatus = this.elementForm.value.destinationStatus?.id;

    if (!this.object.id) {
      this._service.create(this.object).pipe(
        tap(resp => {
          this.dialogRef.close(resp);
        }),
        catchError(error => {
          console.error(error);
          return throwError(error);
        })
      ).subscribe();
    } else {
      this._service.update(this.object).pipe(
        tap(resp => {
          this.dialogRef.close(resp);
        }),
        catchError(error => {
          console.error(error);
          return throwError(error);
        })
      ).subscribe();
    }

  }

  getTitle() {
    return this.object.name ? "Editar Ação \"" + this.object.name + "\"" : "Cadastrar nova Ação";
  }


}
