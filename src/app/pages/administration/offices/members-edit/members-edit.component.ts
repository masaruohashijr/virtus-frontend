import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MemberDTO } from 'src/app/domain/dto/member.dto';
import { OfficeDTO } from 'src/app/domain/dto/office.dto';
import { UserDTO } from 'src/app/domain/dto/user.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { UsersService } from 'src/app/services/administration/users.service';

@Component({
  selector: 'app-members-edit',
  templateUrl: './members-edit.component.html',
  styleUrls: ['./members-edit.component.css']
})
export class MembersEditComponent extends BaseCrudEditComponent<MemberDTO> implements OnInit {

  private father: OfficeDTO
  private object: MemberDTO

  users: UserDTO[] = []

  elementForm = this._formBuilder.group({
    user: [this.data.object.user, [Validators.required]],
    startsAt: [this.data.object.startsAt],
    endsAt: [this.data.object.endsAt]
  });

  constructor(public dialogRef: MatDialogRef<MembersEditComponent>,
    private _entityService: UsersService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { father: OfficeDTO, object: MemberDTO }) {
    super();
    this.father = data.father;
    this.object = data.object;
  }

  ngOnInit(): void {
    this._entityService.getAll('', 0, 200).subscribe(resp => {
      this.users = resp.content;
    })
  }

  save() {
    if (this.elementForm.invalid) {
      this.elementForm.markAllAsTouched()
      return;
    }

    this.object.user = this.elementForm.value.user;
    this.object.startsAt = this.elementForm.value.startsAt;
    this.object.endsAt = this.elementForm.value.endsAt;
    this.dialogRef.close(this.object);
  }

  getTitle() {
    return this.object?.user?.id ? "Editar Membro \"" + this.object.user?.name + "\"" : "Cadastrar novo Membro";
  }

}
