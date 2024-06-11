import { Component, OnInit, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { AlertDialogComponent } from 'src/app/components/dialog/alert-dialog/alert-dialog.component';
import { SupervisorDTO } from 'src/app/domain/dto/supervisor.dto';
import { TeamDTO } from 'src/app/domain/dto/team.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { BaseCrudPageComponent } from 'src/app/pages/common/base-crud-page/base-crud-page.component';
import { TeamsService } from 'src/app/services/coordination/teams.service';
import { TeamMembersListComponent } from './team-members-list/team-members-list.component';

@Component({
  selector: 'app-assing-teams-edit',
  templateUrl: './assing-teams-edit.component.html',
  styleUrls: ['./assing-teams-edit.component.css']
})
export class AssingTeamsEditComponent extends BaseCrudEditComponent<TeamDTO> implements OnInit {

  principalForm = this._formBuilder.group({
    entity: [this.object.entity.name],
    cycle: [this.object.cycle.name],
    supervisor: [this.object.supervisor],
  });

  allSupervisors: SupervisorDTO[] = [];

  @ViewChild('teamMemberList', { static: true }) teamMemberList!: TeamMembersListComponent;

  constructor(public dialogRef: MatDialogRef<AssingTeamsEditComponent>,
    private _formBuilder: FormBuilder,
    private service: TeamsService,
    private errorDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public object: TeamDTO) {
    super();
  }

  ngOnInit(): void {
    this.service.getAllSupervisorsByCurrentId().subscribe((resp) => {
      this.allSupervisors = resp;
    });
  }

  compareSupervisor(object1: SupervisorDTO, object2: SupervisorDTO) {
    return object1 && object2 ? object1.userId === object2.userId : object1 === object2
  }

  supervisorAlterado(event: any) {
    this.object.supervisor = event.value;
    this.teamMemberList.cleanList();
  }

  save() {
    if (this.principalForm.invalid) {
      this.principalForm.markAllAsTouched()
      return;
    }

    this.object.supervisor = this.principalForm.value.supervisor;


    this.service.assignTeam(this.object).pipe(
      tap(resp => {
        this.dialogRef.close(resp);
      }),
      catchError(error => {
        this.mostrarErro(error, this.errorDialog);

        return throwError(error);
      })
    ).subscribe();

  }

  getTitle() {
    return "Designar Equipe";
  }

}
