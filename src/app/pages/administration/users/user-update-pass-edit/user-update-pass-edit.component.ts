import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, tap, throwError } from 'rxjs';
import { AlertDialogComponent } from 'src/app/components/dialog/alert-dialog/alert-dialog.component';
import { UserUpdatePasswordDTO } from 'src/app/domain/dto/user-update-password.dto';
import { UserDTO } from 'src/app/domain/dto/user.dto';
import { UsersService } from 'src/app/services/administration/users.service';

@Component({
  selector: 'app-user-update-pass-edit',
  templateUrl: './user-update-pass-edit.component.html',
  styleUrls: ['./user-update-pass-edit.component.css']
})
export class UserUpdatePassEditComponent implements OnInit {

  hide = true;

  hideRep = true;

  elementForm = this._formBuilder.group({
    username: [{ value: this.object.username, disabled: true }, [Validators.required]],
    password: ['', [Validators.required]],
    repeatedPassword: ['', [Validators.required]]
  });

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<UserUpdatePassEditComponent>,
    private _service: UsersService,
    private _formBuilder: FormBuilder,
    @Inject(MatDialog) private errorDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public object: UserDTO
  ) {
  }

  ngOnInit(): void {
  }

  getTitle() {
    return "Alterar Senha do Usuário \"" + this.object?.name + "\"";
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    let userUpdatePass = new UserUpdatePasswordDTO();
    userUpdatePass.userId = this.object.id;
    userUpdatePass.password = this.elementForm.value.password?.toString();
    userUpdatePass.repeatedPassword = this.elementForm.value.repeatedPassword?.toString();

    this._service.updatePassword(userUpdatePass).pipe(
      tap(resp => {
        this.dialogRef.close(resp);
      }),
      catchError(error => {
        this.mostrarErro(error, this.errorDialog);
        return throwError(error);
      })
    ).subscribe();
  }

  mostrarErro(error: any, errorDialog: MatDialog) {
    const errorDialogRef = errorDialog.open(AlertDialogComponent, {
      width: '350px',
      data: {
        title: "Erro",
        message: error.error?.message ? error.error?.message : "Erro interno no servidor."
      },
    });

    errorDialogRef.afterClosed().subscribe(result => {

    });
  }

}
