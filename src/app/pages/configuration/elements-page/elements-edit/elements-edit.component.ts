import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, tap, throwError } from 'rxjs';
import { ElementDTO } from 'src/app/domain/dto/element.dto';
import { ElementsService } from 'src/app/services/configuration/elements.service';

@Component({
  selector: 'app-elements-edit',
  templateUrl: './elements-edit.component.html',
  styleUrls: ['./elements-edit.component.css']
})
export class ElementsEditComponent implements OnInit {

  elementForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    description: [this.object.description],
    reference: [this.object.reference],
    author: [this.object.author?.name],
    createdAt: [this.object.createdAt]
  });

  constructor(public dialogRef: MatDialogRef<ElementsEditComponent>,
    private _formBuilder: FormBuilder,
    private service: ElementsService,
    @Inject(MAT_DIALOG_DATA) public object: ElementDTO) { }

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
    return this.object.name ? "Editar Elemento \"" + this.object.name + "\"" : "Cadastrar novo Elemento";
  }

}
