import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, tap, throwError } from 'rxjs';
import { OfficeDTO } from 'src/app/domain/dto/office.dto';
import { UserDTO } from 'src/app/domain/dto/user.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { OfficesService } from 'src/app/services/administration/offices.service';
import { UsersService } from 'src/app/services/administration/users.service';

@Component({
  selector: 'app-offices-members-edit',
  templateUrl: './offices-members-edit.component.html',
  styleUrls: ['./offices-members-edit.component.css']
})
export class OfficesMembersEditComponent extends BaseCrudEditComponent<OfficeDTO> implements OnInit {

  users: UserDTO[] = [];

  elementForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    abbreviation: [this.object.abbreviation, [Validators.required]],
    description: [this.object.description],
    boss: [this.object.boss]
  });

  constructor(public dialogRef: MatDialogRef<OfficesMembersEditComponent>,
    private _service: OfficesService,
    private _usersService: UsersService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public object: OfficeDTO) {
    super();
  }

  ngOnInit(): void {
    this._usersService.getAllByRole(2).subscribe(resp => {
      this.users = resp;
    })
  }

  getTitle() {
    return this.object?.name ? "Editar Escritório \"" + this.object?.name + "\"" : "Cadastrar novo Escritório";
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.name = this.elementForm.value.name?.toString();
    this.object.abbreviation = this.elementForm.value.abbreviation?.toString();
    this.object.description = this.elementForm.value.description?.toString();
    if (this.elementForm.value.boss != null) {
      this.object.boss = this.elementForm.value.boss;
    }
    this._service.updateMembers(this.object).pipe(
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
