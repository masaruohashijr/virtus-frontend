import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, tap, throwError } from 'rxjs';
import { OfficeDTO } from 'src/app/domain/dto/office.dto';
import { UserDTO } from 'src/app/domain/dto/user.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { OfficesService } from 'src/app/services/administration/offices.service';
import { UsersService } from 'src/app/services/administration/users.service';

@Component({
  selector: 'app-offices-jurisdictions-edit',
  templateUrl: './offices-jurisdictions-edit.component.html',
  styleUrls: ['./offices-jurisdictions-edit.component.css']
})
export class OfficesJurisdictionsEditComponent extends BaseCrudEditComponent<OfficeDTO> implements OnInit {

  users: UserDTO[] = [];
  isEdit: boolean;

  elementForm!: FormGroup<{
    name: FormControl<string | null>;
    abbreviation: FormControl<string | null>;
    description: FormControl<string | null>;
    boss: FormControl<UserDTO | null>;
  }>;

  constructor(
    public dialogRef: MatDialogRef<OfficesJurisdictionsEditComponent>,
    private _service: OfficesService,
    private _usersService: UsersService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public object: OfficeDTO
  ) {
    super();
    this.isEdit = !!this.object?.id;

    this.elementForm = this._formBuilder.group({
      name: this._formBuilder.control(this.object.name ?? '', Validators.required),
      abbreviation: this._formBuilder.control(this.object.abbreviation ?? '', Validators.required),
      description: this._formBuilder.control(this.object.description ?? ''),
      boss: this._formBuilder.control<UserDTO | null>(
        { value: this.object.boss ?? null, disabled: true } // desabilita chefe
      )
    });
  }

  ngOnInit(): void {
    this._usersService.getAll('', 0, 1000).subscribe(resp => {
      this.users = resp.content;
    });
  }

  getTitle() {
    return `Editar Jurisdição do Escritório: ${this.object?.name}`;
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched();
      return;
    }

    const formValue = this.elementForm.getRawValue(); // inclui campos desabilitados

    this.object.name = formValue.name ?? '';
    this.object.abbreviation = formValue.abbreviation ?? '';
    this.object.description = formValue.description ?? '';
    // Não atualiza o chefe (campo desabilitado)

    this._service.updateJurisdictions(this.object).pipe(
      tap(resp => {
        this.dialogRef.close(resp);
      }),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    ).subscribe();
  }
}
