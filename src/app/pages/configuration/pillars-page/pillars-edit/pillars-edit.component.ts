import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, tap, throwError } from 'rxjs';
import { PillarDTO } from 'src/app/domain/dto/pillar.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { PillarsService } from 'src/app/services/configuration/pillars.service';

@Component({
  selector: 'app-pillars-edit',
  templateUrl: './pillars-edit.component.html',
  styleUrls: ['./pillars-edit.component.css']
})
export class PillarsEditComponent extends BaseCrudEditComponent<PillarDTO> implements OnInit {
  contador = 0;
  errorMessage: string = "";
  pillarForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    description: [this.object.description],
    reference: [this.object.reference],
  });

  constructor(public dialogRef: MatDialogRef<PillarsEditComponent>,
    private _formBuilder: FormBuilder,
    private service: PillarsService,
    private errorDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public object: PillarDTO) {
    super();
  }

ngOnInit(): void {
    this.atualizarContador();
    this.pillarForm
      .get("description")
      ?.valueChanges.subscribe((val: string | null | undefined) => {
        this.contador = val?.length || 0;

        if (this.contador > 8000) {
          this.errorMessage = "Limite de 8000 caracteres atingido.";
          const truncated = (val ?? "").substring(0, 8000);
          this.pillarForm
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
    const descValue = this.pillarForm.get("description")?.value ?? "";
    this.contador = descValue.length;
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
          this.mostrarErro(error, this.errorDialog);

          return throwError(error);
        })
      ).subscribe();
    }

  }

  getTitle() {
    return this.object.name ? "Editar Pilar \"" + this.object.name + "\"" : "Cadastrar novo Pilar";
  }

}
