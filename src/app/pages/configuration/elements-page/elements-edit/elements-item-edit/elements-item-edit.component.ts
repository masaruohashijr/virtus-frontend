import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ElementItemDTO } from "src/app/domain/dto/element-item.dto";
import { ElementDTO } from "src/app/domain/dto/element.dto";

@Component({
  selector: "app-elements-item-edit",
  templateUrl: "./elements-item-edit.component.html",
  styleUrls: ["./elements-item-edit.component.css"],
})
export class ElementsItemEditComponent implements OnInit {
  contador = 0;
  errorMessage: string = "";
  private father: ElementDTO;
  private object: ElementItemDTO;
  elementItemForm = this._formBuilder.group({
    name: [this.data.object.name, [Validators.required]],
    description: [this.data.object.description],
    reference: [this.data.object.reference],
  });

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<ElementsItemEditComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { father: ElementDTO; object: ElementItemDTO }
  ) {
    this.father = data.father;
    this.object = data.object;
    console.log(this.father);
  }

  ngOnInit(): void {
    this.atualizarContador();
    this.elementItemForm
      .get("description")
      ?.valueChanges.subscribe((val: string | null | undefined) => {
        this.contador = val?.length || 0;

        if (this.contador > 8000) {
          this.errorMessage = "Limite de 8000 caracteres atingido.";
          const truncated = (val ?? "").substring(0, 8000);
          this.elementItemForm
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
    const descValue = this.elementItemForm.get("description")?.value ?? "";
    this.contador = descValue.length;
  }

  save() {
    if (this.elementItemForm.invalid) {
      this.elementItemForm.markAllAsTouched();
      return;
    }

    this.object.name = this.elementItemForm.value.name?.toString();
    this.object.description = this.elementItemForm.value.description?.toString();
    this.object.reference = this.elementItemForm.value.reference?.toString();

    this.dialogRef.close(this.object);
  }

  getTitle() {
    return this.object.name
      ? 'Editar Item "' + this.object.name + '"'
      : "Cadastrar novo Item";
  }
}
