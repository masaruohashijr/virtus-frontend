import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PillarsEditComponent } from '../../pillars-page/pillars-edit/pillars-edit.component';
import { CyclesService } from 'src/app/services/configuration/cycles.service';
import { CycleDTO } from 'src/app/domain/dto/cycle.dto';
import { catchError, tap, throwError } from 'rxjs';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';

@Component({
  selector: 'app-cycles-edit',
  templateUrl: './cycles-edit.component.html',
  styleUrls: ['./cycles-edit.component.css']
})
export class CyclesEditComponent extends BaseCrudEditComponent<CycleDTO> implements OnInit {

  pillarForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    description: [this.object.description],
    reference: [this.object.reference],
  });

  constructor(public dialogRef: MatDialogRef<PillarsEditComponent>,
    private _formBuilder: FormBuilder,
    private service: CyclesService,
    private errorDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public object: CycleDTO) {
      super();
     }

  ngOnInit(): void {
  }

  save() {
    if (this.pillarForm.invalid) {
      this.pillarForm.markAllAsTouched()
      return;
    }

    this.object.name = this.pillarForm.value.name?.toString();
    this.object.description = this.pillarForm.value.description?.toString();
    this.object.reference = this.pillarForm.value.reference?.toString();

    if (!this.object.id) {
      this.service.create(this.object).pipe(
        tap(resp => {
          this.dialogRef.close(resp);
        }),
        catchError(error => {
          this.mostrarErro(error, this.errorDialog);

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
    return this.object.name ? "Editar Ciclo \"" + this.object.name + "\"" : "Cadastrar novo Ciclo";
  }

}
