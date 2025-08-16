import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, tap, throwError } from 'rxjs';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';
import { EntityVirtusService } from 'src/app/services/rating/entity-virtus.service';

@Component({
  selector: 'app-entities-edit',
  templateUrl: './entities-edit.component.html',
  styleUrls: ['./entities-edit.component.css']
})
export class EntitiesEditComponent implements OnInit {

  ufs: string[] = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS',
    'SC', 'SE', 'SP', 'TO'];

  object!: EntityVirtusDTO

  mainForm!: FormGroup;

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<EntitiesEditComponent>,
    private _formBuilder: FormBuilder,
    private service: EntityVirtusService,
    @Inject(MAT_DIALOG_DATA) public data: { object: EntityVirtusDTO, readOnly: boolean }
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.object = this.data.object;
    this.mainForm = this._formBuilder.group({
      name: [{ value: this.object.name, disabled: this.data.readOnly }, [Validators.required]],
      description: [{ value: this.object.description, disabled: this.data.readOnly }],
      acronym: [{ value: this.object.acronym, disabled: this.data.readOnly }, [Validators.required]],
      code: [{ value: this.object.code, disabled: this.data.readOnly }],
      situation: [{ value: this.object.situation, disabled: this.data.readOnly }],
      esi: [{ value: this.object.esi, disabled: this.data.readOnly }],
      city: [{ value: this.object.city, disabled: this.data.readOnly }],
      uf: [{ value: this.object.uf, disabled: this.data.readOnly }]
    });
  }

  save() {
    if (this.mainForm.invalid) {
      this.mainForm.markAllAsTouched()
      return;
    }

    this.object.name = this.mainForm.value.name?.toString();
    this.object.description = this.mainForm.value.description?.toString();
    this.object.acronym = this.mainForm.value.acronym?.toString();
    this.object.code = this.mainForm.value.code?.toString();
    this.object.situation = this.mainForm.value.situation?.toString();
    this.object.esi = this.mainForm.value.esi ? this.mainForm.value.esi : false;
    this.object.city = this.mainForm.value.city?.toString();
    this.object.uf = this.mainForm.value.uf?.toString();

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
    return this.object.name ? "Editar Entidade \"" + this.object.name + "\"" : "Cadastrar nova Entidade";
  }

}
