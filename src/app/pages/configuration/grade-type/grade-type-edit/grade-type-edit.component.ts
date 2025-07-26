import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap, catchError, throwError } from 'rxjs';
import { GradeTypeDTO } from 'src/app/domain/dto/type-of-note.dto';
import { GradeTypeService } from 'src/app/services/configuration/grade-type.service';

@Component({
  selector: "app-grade-type-edit",
  templateUrl: "./grade-type-edit.component.html",
  styleUrls: ["./grade-type-edit.component.css"],
})
export class GradeTypeEditComponent implements OnInit {
  contador = 0;
  errorMessage: string = "";
  gradeTypeForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    description: [this.object.description],
    reference: [this.object.reference],
    letter: [this.object.letter, Validators.required],
    letterColor: [this.object.letterColor, Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<GradeTypeEditComponent>,
    private _formBuilder: FormBuilder,
    private _gradeTypeService: GradeTypeService,
    @Inject(MAT_DIALOG_DATA) public object: GradeTypeDTO
  ) {}

  ngOnInit(): void {
    this.atualizarContador();
    this.gradeTypeForm
      .get("description")
      ?.valueChanges.subscribe((val: string | null | undefined) => {
        this.contador = val?.length || 0;

        if (this.contador > 8000) {
          this.errorMessage = "Limite de 8000 caracteres atingido.";
          const truncated = (val ?? "").substring(0, 8000);
          this.gradeTypeForm
            .get("description")
            ?.setValue(truncated, { emitEvent: false });
          this.contador = 8000;
        } else if (this.contador < 4 && this.contador >= 0) {
          this.errorMessage =
            "A descrição deve conter entre 4 e 8000 caracteres.";
        } else {
          this.errorMessage = "";
        }
      });
  }

  atualizarContador() {
    const descValue = this.gradeTypeForm.get("description")?.value ?? "";
    this.contador = descValue.length;
  }

  save() {
    if (this.gradeTypeForm.invalid) {
      this.gradeTypeForm.markAllAsTouched();
      return;
    }

    this.object.name = this.gradeTypeForm.value.name?.toString();
    this.object.description = this.gradeTypeForm.value.description?.toString();
    this.object.reference = this.gradeTypeForm.value.reference?.toString();
    this.object.letter = this.gradeTypeForm.value.letter?.toString();
    this.object.letterColor = this.gradeTypeForm.value.letterColor?.toString();

    if (!this.object.id) {
      this._gradeTypeService
        .create(this.object)
        .pipe(
          tap((resp) => {
            this.dialogRef.close(resp);
          }),
          catchError((error) => {
            console.error(error);
            return throwError(error);
          })
        )
        .subscribe();
    } else {
      this._gradeTypeService
        .update(this.object)
        .pipe(
          tap((resp) => {
            this.dialogRef.close(resp);
          }),
          catchError((error) => {
            console.error(error);
            return throwError(error);
          })
        )
        .subscribe();
    }
  }

  getTitle() {
    return this.object.name
      ? 'Editar Tipo de Nota "' + this.object.name + '"'
      : "Cadastrar novo Tipo de Nota";
  }
}
