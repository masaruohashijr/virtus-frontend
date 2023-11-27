import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { SupervisorDTO } from 'src/app/domain/dto/supervisor.dto';
import { TeamDTO } from 'src/app/domain/dto/team.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { BaseCrudPageComponent } from 'src/app/pages/common/base-crud-page/base-crud-page.component';
import { TeamsService } from 'src/app/services/coordination/teams.service';

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

  constructor(public dialogRef: MatDialogRef<AssingTeamsEditComponent>,
    private _formBuilder: FormBuilder,
    private service: TeamsService,
    @Inject(MAT_DIALOG_DATA) public object: TeamDTO) {
      super();
     }

  ngOnInit(): void {
    this.service.getAllSupervisorsByCurrentId().subscribe((resp) => {
      this.allSupervisors = resp;
    });
  }

  save() {
    if (this.principalForm.invalid) {
      this.principalForm.markAllAsTouched()
      return;
    }

    this.object.supervisor = this.principalForm.value.supervisor;

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
    return "Designar Equipe";
  }

}
