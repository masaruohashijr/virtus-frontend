import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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

  mainForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    description: [this.object.description],
    acronym: [this.object.acronym, [Validators.required]],
    code: [this.object.code],
    situation: [this.object.situation],
    esi: [this.object.esi],
    city: [this.object.city],
    uf: [this.object.uf]
  });

  constructor(public dialogRef: MatDialogRef<EntitiesEditComponent>,
    private _formBuilder: FormBuilder,
    private service: EntityVirtusService,
    @Inject(MAT_DIALOG_DATA) public object: EntityVirtusDTO) { }

  ngOnInit(): void {
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
