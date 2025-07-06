import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, tap, throwError } from 'rxjs';
import { ComponentDTO } from 'src/app/domain/dto/components.dto';
import { ComponentsService } from 'src/app/services/configuration/components.service';

@Component({
  selector: 'app-components-edit',
  templateUrl: './components-edit.component.html',
  styleUrls: ['./components-edit.component.css']
})
export class ComponentsEditComponent implements OnInit {

  componentForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    description: [this.object.description],
    reference: [this.object.reference],
    author: [this.object.author?.name],
    createdAt: [this.object.createdAt]
  });

  constructor(public dialogRef: MatDialogRef<ComponentsEditComponent>,
    private _formBuilder: FormBuilder,
    private service: ComponentsService,
    @Inject(MAT_DIALOG_DATA) public object: ComponentDTO) { }

  ngOnInit(): void {
  }

  save() {
    if (this.componentForm.invalid) {
      this.componentForm.markAllAsTouched()
      return;
    }

    this.object.name = this.componentForm.value.name?.toString();
    this.object.description = this.componentForm.value.description?.toString();
    this.object.reference = this.componentForm.value.reference?.toString();

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
    return this.object.name ? "Editar Componente \"" + this.object.name + "\"" : "Cadastrar novo Componente";
  }

}
