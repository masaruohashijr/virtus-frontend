import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { catchError, tap, throwError } from "rxjs";
import { ElementDTO } from "src/app/domain/dto/element.dto";
import { ElementsService } from "src/app/services/configuration/elements.service";

@Component({
  selector: "app-elements-edit",
  templateUrl: "./elements-edit.component.html",
  styleUrls: ["./elements-edit.component.css"],
})
export class ElementsEditComponent implements OnInit {
  contador = 0;

  elementForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    description: [this.object.description],
    reference: [this.object.reference],
    author: [this.object.author?.name],
    createdAt: [this.object.createdAt],
  });

  errorMessage: string = "";

  constructor(
    public dialogRef: MatDialogRef<ElementsEditComponent>,
    private _formBuilder: FormBuilder,
    private service: ElementsService,
    @Inject(MAT_DIALOG_DATA) public object: ElementDTO
  ) {}

  ngOnInit(): void {
    this.atualizarContador();
    this.elementForm
      .get("description")
      ?.valueChanges.subscribe((val: string | null | undefined) => {
        this.contador = val?.length || 0;

        if (this.contador > 8000) {
          this.errorMessage = "Limite de 8000 caracteres atingido.";
          const truncated = (val ?? "").substring(0, 8000);
          this.elementForm
            .get("description")
            ?.setValue(truncated, { emitEvent: false });
          this.contador = 8000;
        } else if (this.contador < 4 && this.contador >= 0) {
          this.errorMessage = "A descrição deve conter entre 4 e 8000 caracteres.";
        } else {
          this.errorMessage = "";
        }
      });
  }

  atualizarContador() {
    const descValue = this.elementForm.get("description")?.value ?? "";
    this.contador = descValue.length;
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched();
      return;
    }

    this.object.name = this.elementForm.value.name?.toString();
    this.object.description = this.elementForm.value.description?.toString();
    this.object.reference = this.elementForm.value.reference?.toString();

    if (!this.object.id) {
      this.service
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
      this.service
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
      ? 'Editar Elemento "' + this.object.name + '"'
      : "Cadastrar novo Elemento";
  }
}
