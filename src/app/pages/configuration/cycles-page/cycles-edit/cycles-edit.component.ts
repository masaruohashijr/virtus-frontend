import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { PillarsEditComponent } from "../../pillars-page/pillars-edit/pillars-edit.component";
import { CyclesService } from "src/app/services/configuration/cycles.service";
import { CycleDTO } from "src/app/domain/dto/cycle.dto";
import { catchError, tap, throwError } from "rxjs";
import { BaseCrudEditComponent } from "src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component";

@Component({
  selector: "app-cycles-edit",
  templateUrl: "./cycles-edit.component.html",
  styleUrls: ["./cycles-edit.component.css"],
})
export class CyclesEditComponent
  extends BaseCrudEditComponent<CycleDTO>
  implements OnInit
{
  contador = 0;
  errorMessage: string = "";
  cycleForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    description: [this.object.description],
    reference: [this.object.reference],
  });

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<PillarsEditComponent>,
    private _formBuilder: FormBuilder,
    private service: CyclesService,
    @Inject(MatDialogRef) private errorDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public object: CycleDTO
  ) {
    super();
  }

  ngOnInit(): void {
    this.atualizarContador();
    this.cycleForm
      .get("description")
      ?.valueChanges.subscribe((val: string | null | undefined) => {
        this.contador = val?.length || 0;

        if (this.contador > 8000) {
          this.errorMessage = "Limite de 8000 caracteres atingido.";
          const truncated = (val ?? "").substring(0, 8000);
          this.cycleForm
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
    const descValue = this.cycleForm.get("description")?.value ?? "";
    this.contador = descValue.length;
  }

  save() {
    if (this.cycleForm.invalid) {
      this.cycleForm.markAllAsTouched();
      return;
    }

    this.object.name = this.cycleForm.value.name?.toString();
    this.object.description = this.cycleForm.value.description?.toString();
    this.object.reference = this.cycleForm.value.reference?.toString();

    if (!this.object.id) {
      this.service
        .create(this.object)
        .pipe(
          tap((resp) => {
            this.dialogRef.close(resp);
          }),
          catchError((error) => {
            this.mostrarErro(error, this.errorDialog);

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
      ? 'Editar Ciclo "' + this.object.name + '"'
      : "Cadastrar novo Ciclo";
  }
}
