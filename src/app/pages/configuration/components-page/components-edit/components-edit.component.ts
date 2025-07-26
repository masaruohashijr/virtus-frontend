import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { catchError, tap, throwError } from "rxjs";
import { ComponentDTO } from "src/app/domain/dto/components.dto";
import { ComponentsService } from "src/app/services/configuration/components.service";

@Component({
  selector: "app-components-edit",
  templateUrl: "./components-edit.component.html",
  styleUrls: ["./components-edit.component.css"],
})
export class ComponentsEditComponent implements OnInit {
  contador = 0;
  errorMessage: string = "";
  componentForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    description: [this.object.description],
    reference: [this.object.reference],
    author: [this.object.author?.name],
    createdAt: [this.object.createdAt],
  });

  constructor(
    public dialogRef: MatDialogRef<ComponentsEditComponent>,
    private _formBuilder: FormBuilder,
    private service: ComponentsService,
    @Inject(MAT_DIALOG_DATA) public object: ComponentDTO
  ) {}

  ngOnInit(): void {
    this.atualizarContador();
    this.componentForm
      .get("description")
      ?.valueChanges.subscribe((val: string | null | undefined) => {
        this.contador = val?.length || 0;

        if (this.contador > 8000) {
          this.errorMessage = "Limite de 8000 caracteres atingido.";
          const truncated = (val ?? "").substring(0, 8000);
          this.componentForm
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
    const descValue = this.componentForm.get("description")?.value ?? "";
    this.contador = descValue.length;
  }

  save() {
    if (this.componentForm.invalid) {
      this.componentForm.markAllAsTouched();
      return;
    }

    this.object.name = this.componentForm.value.name?.toString();
    this.object.description = this.componentForm.value.description?.toString();
    this.object.reference = this.componentForm.value.reference?.toString();

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
      ? 'Editar Componente "' + this.object.name + '"'
      : "Cadastrar novo Componente";
  }
}
