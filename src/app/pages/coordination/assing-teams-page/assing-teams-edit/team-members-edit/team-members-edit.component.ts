import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { AlertDialogComponent } from 'src/app/components/dialog/alert-dialog/alert-dialog.component';
import { MemberDTO } from 'src/app/domain/dto/member.dto';
import { TeamMemberDTO } from 'src/app/domain/dto/team-member.dto';
import { TeamDTO } from 'src/app/domain/dto/team.dto';
import { UserDTO } from 'src/app/domain/dto/user.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { UsersService } from 'src/app/services/administration/users.service';
import { TeamsService } from 'src/app/services/coordination/teams.service';

@Component({
  selector: 'app-team-members-edit',
  templateUrl: './team-members-edit.component.html',
  styleUrls: ['./team-members-edit.component.css']
})
export class TeamMembersEditComponent extends BaseCrudEditComponent<TeamMemberDTO> implements OnInit {

  private father: TeamDTO
  object: TeamMemberDTO

  allMembers: MemberDTO[] = []

  principalForm = this._formBuilder.group({
    member: [this.data.object.member, [Validators.required]]
  });

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<TeamMembersEditComponent>,
    private userService: UsersService,
    private teamService: TeamsService,
    @Inject(MatDialog) private errorDialog: MatDialog,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { father: TeamDTO, object: TeamMemberDTO }
  ) {
    super();
    this.father = data.father;
    this.object = data.object;
  }

  ngOnInit(): void {
    this.teamService.getAllMembersByBoss().subscribe(resp => {
      this.allMembers = resp.filter(m =>
        m.id !== this.father.supervisor?.userId
        && this.father.teamMembers.filter(memb => memb.member?.id == m.id).length == 0);
      if (this.object.member) {
        this.allMembers.push(this.object.member);
      }
      console.log(this.allMembers)
    })
  }

  save() {
    if (this.principalForm.invalid) {
      this.principalForm.markAllAsTouched()
      return;
    }
    if(!this.father.supervisor){
      this.errorDialog.open(AlertDialogComponent, {
            width: '350px',
            data: {
              title: "Erro",
              message: "Você precisa informar o supervisor antes de cadastrar um Integrante."
            },
          });
          return;
    }
    this.object.member = this.principalForm.value.member;
    this.dialogRef.close(this.object);
  }

  getTitle() {
    return this.object.member?.user?.name ? "Editar Integrante \"" + this.object.member?.user?.name + "\"" : "Cadastrar novo Integrante";
  }

}
