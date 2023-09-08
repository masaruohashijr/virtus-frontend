import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, tap, throwError } from 'rxjs';
import { RoleDTO } from 'src/app/domain/dto/role.dto';
import { UserDTO } from 'src/app/domain/dto/user.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { RolesService } from 'src/app/services/administration/roles.service';
import { UsersService } from 'src/app/services/administration/users.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent extends BaseCrudEditComponent<UserDTO> implements OnInit {

  roles: RoleDTO[] = [];

  hide = true;

  elementForm = this._formBuilder.group({
    name: [this.object.name, [Validators.required]],
    username: [this.object.username, [Validators.required]],
    password: [this.object.password],
    email: [this.object.email, [Validators.required]],
    mobile: [this.object.mobile,],
    role: [this.object.role]
  });

  constructor(public dialogRef: MatDialogRef<UserEditComponent>,
    private _service: UsersService,
    private _rolesService: RolesService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public object: UserDTO) {
    super();
  }

  ngOnInit(): void {
    this._rolesService.getAll('', 0, 1000).subscribe(resp => {
      this.roles = resp.content;
    })
  }

  getTitle() {
    return this.object?.name ? "Editar Usuário \"" + this.object?.name + "\"" : "Cadastrar novo Usuário";
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.name = this.elementForm.value.name?.toString();
    this.object.username = this.elementForm.value.username?.toString();
    this.object.email = this.elementForm.value.email?.toString();
    this.object.mobile = this.elementForm.value.mobile?.toString();
    this.object.password = this.elementForm.value.password?.toString();
    if (this.elementForm.value.role != null) {
      this.object.role = this.elementForm.value.role;
    }
    if (!this.object.id) {
      this._service.create(this.object).pipe(
        tap(resp => {
          this.dialogRef.close(resp);
        }),
        catchError(error => {
          console.error(error);
          return throwError(error);
        })
      ).subscribe();
    } else {
      this._service.update(this.object).pipe(
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

}
