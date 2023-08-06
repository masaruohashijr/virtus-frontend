import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, tap, throwError } from 'rxjs';
import { PillarDTO } from 'src/app/domain/dto/pillar.dto';
import { PillarsService } from 'src/app/services/configuration/pillars.service';

@Component({
  selector: 'app-pillars-edit',
  templateUrl: './pillars-edit.component.html',
  styleUrls: ['./pillars-edit.component.css']
})
export class PillarsEditComponent implements OnInit {

  pillarForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    description: [this.object.description],
    reference: [this.object.reference],
  });

  constructor(public dialogRef: MatDialogRef<PillarsEditComponent>,
    private _formBuilder: FormBuilder,
    private service: PillarsService,
    @Inject(MAT_DIALOG_DATA) public object: PillarDTO) { }

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
    return this.object.name ? "Editar Pillar \"" + this.object.name + "\"" : "Cadastrar novo Pillar";
  }

}
