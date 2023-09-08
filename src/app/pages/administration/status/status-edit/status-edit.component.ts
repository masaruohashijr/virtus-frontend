import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { tap } from 'rxjs/internal/operators/tap';
import { StatusDTO } from 'src/app/domain/dto/status.dto';
import { StatusService } from 'src/app/services/administration/status.service';

@Component({
  selector: 'app-status-edit',
  templateUrl: './status-edit.component.html',
  styleUrls: ['./status-edit.component.css']
})
export class StatusEditComponent implements OnInit {

  elementForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    description: [this.object.description],
    stereotype: [this.object.stereotype]
  });

  constructor(public dialogRef: MatDialogRef<StatusEditComponent>,
    private _formBuilder: FormBuilder,
    private service: StatusService,
    @Inject(MAT_DIALOG_DATA) public object: StatusDTO) { }

  ngOnInit(): void {
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.name = this.elementForm.value.name?.toString();
    this.object.description = this.elementForm.value.description?.toString();
    this.object.stereotype = this.elementForm.value.stereotype?.toString();

    if (!this.object.id) {
      this.service.create(this.object).pipe(
        tap(resp => {
          this.dialogRef.close(resp);
        }),
        catchError(error => {
          console.error(error);
          return throwError(error);
        })
      ).subscribe();
    } else {
      this.service.update(this.object).pipe(
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
    return this.object.name ? "Editar Status \"" + this.object.name + "\"" : "Cadastrar novo Status";
  }

}
