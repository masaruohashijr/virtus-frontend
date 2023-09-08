import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, tap, throwError } from 'rxjs';
import { FeatureDTO } from 'src/app/domain/dto/feature.dto';
import { FeaturesService } from 'src/app/services/administration/features.service';

@Component({
  selector: 'app-features-edit',
  templateUrl: './features-edit.component.html',
  styleUrls: ['./features-edit.component.css']
})
export class FeaturesEditComponent implements OnInit {

  elementForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    code: [this.object.code, [Validators.required]],
    description: [this.object.description]
  });

  constructor(public dialogRef: MatDialogRef<FeaturesEditComponent>,
    private _formBuilder: FormBuilder,
    private service: FeaturesService,
    @Inject(MAT_DIALOG_DATA) public object: FeatureDTO) { }

  ngOnInit(): void {
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.name = this.elementForm.value.name?.toString();
    this.object.description = this.elementForm.value.description?.toString();
    this.object.code = this.elementForm.value.code?.toString();

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
    return this.object.name ? "Editar Funcionalidade \"" + this.object.name + "\"" : "Cadastrar nova Funcionalidade";
  }

}
