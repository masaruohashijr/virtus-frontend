import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MemberDTO } from "src/app/domain/dto/member.dto";
import { OfficeDTO } from "src/app/domain/dto/office.dto";
import { UserDTO } from "src/app/domain/dto/user.dto";
import { BaseCrudEditComponent } from "src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component";
import { UsersService } from "src/app/services/administration/users.service";

@Component({
  selector: "app-members-edit",
  templateUrl: "./members-edit.component.html",
  styleUrls: ["./members-edit.component.css"],
})
export class MembersEditComponent
  extends BaseCrudEditComponent<MemberDTO>
  implements OnInit
{
  private father: OfficeDTO;
  private object: MemberDTO;

  users: UserDTO[] = [];
  offices: OfficeDTO[] = [];

  memberForm = this._formBuilder.group({
    user: [this.data.object.user, [Validators.required]],
    office: [this.data.object.office, [Validators.required]],
    startsAt: [this.data.object.startsAt],
    endsAt: [this.data.object.endsAt],
  });

  constructor(
    public dialogRef: MatDialogRef<MembersEditComponent>,
    private _entityService: UsersService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { father: OfficeDTO; object: MemberDTO }
  ) {
    super();
    this.father = data.father;
    this.object = data.object;
  }

  ngOnInit(): void {
    this._entityService.getAll("", 0, 200).subscribe((resp) => {
      let userMembersIds = this.father.members.map((member) => member.user?.id);

      this.users = resp.content
        .filter((user) => !userMembersIds.includes(user.id))
        .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "")); // ordena por nome

      if (this.object.user && !this.users.includes(this.object.user)) {
        this.users.push(this.object.user);
        this.users.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "")); // reordena com o novo item
      }

      this.offices = [this.father];
    });
  }

  save() {
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      return;
    }

    this.object.user = this.memberForm.value.user;
    this.object.startsAt = this.memberForm.value.startsAt;
    this.object.endsAt = this.memberForm.value.endsAt;
    this.dialogRef.close(this.object);
  }

  getTitle() {
    return this.object?.user?.id
      ? 'Editar Membro "' + this.object.user?.name + '"'
      : "Cadastrar novo Membro";
  }
}
