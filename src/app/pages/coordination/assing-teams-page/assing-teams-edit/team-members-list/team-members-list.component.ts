import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TeamMemberDTO } from 'src/app/domain/dto/team-member.dto';
import { TeamDTO } from 'src/app/domain/dto/team.dto';
import { TeamMembersEditComponent } from '../team-members-edit/team-members-edit.component';
import { ConfirmationDialogComponent } from 'src/app/components/dialog/confirmation-dialog/confirmation-dialog.component';
import { TeamsService } from 'src/app/services/coordination/teams.service';

@Component({
  selector: 'app-team-members-list',
  templateUrl: './team-members-list.component.html',
  styleUrls: ['./team-members-list.component.css']
})
export class TeamMembersListComponent implements OnInit {

  @Input() team!: TeamDTO;

  objectDataSource: MatTableDataSource<TeamMemberDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['name', 'role', "actions"];

  constructor(
    @Inject(MatDialog) public dialog: MatDialog,
    @Inject(MatDialog) public deleteDialog: MatDialog,
    private service: TeamsService,
    private _formBuilder: FormBuilder) { }

  searchForm = this._formBuilder.group({
    filterValue: ['']
  })
  filterControl = this.searchForm.get('filterValue');

  ngOnInit(): void {
    this.loadContent('');
    if (this.filterControl) {
      this.filterControl.valueChanges.pipe(
        debounceTime(300), // Atraso de 300 ms após a última alteração
        distinctUntilChanged() // Filtra apenas valores distintos consecutivos
      ).subscribe(filterValue => {
        this.loadContent(filterValue);
      });
    }
  }

  cleanList(){
    this.team.teamMembers = [];
    this.objectDataSource.data = this.team.teamMembers;
  }

  loadContent(filter: string | null) {
    if (this.team?.teamMembers) {
      if (filter) {
        this.objectDataSource.data = this.team?.teamMembers.filter(it => it.name && it.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
      } else {
        this.objectDataSource.data = this.team?.teamMembers;
      }
    } else {
      this.service.getTeamMembersByTeam(this.team.entity.id, this.team.cycle.id).subscribe((resp)=>{
        this.team.teamMembers = resp;
        this.objectDataSource.data = resp;
      });
    }
  }

  newObject() {
    const dialogRef = this.dialog.open(TeamMembersEditComponent, {
      width: '700px',
      data: {
        father: this.team,
        object: new TeamMemberDTO()
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!this.team.teamMembers) {
        this.team.teamMembers = [];
      }

      if (result) {
        this.team.teamMembers.push(result)
        this.objectDataSource.data = this.team.teamMembers;
      }
    });
  }

  editObject(object: TeamMemberDTO) {
    const dialogRef = this.dialog.open(TeamMembersEditComponent, {
      width: '700px',
      data: {
        father: this.team,
        object: object
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.team.teamMembers.map(item => {
        if (item.id == result.id) {
          item = result;
        }
      })
      this.objectDataSource.data = this.team.teamMembers;
    });
  }

  deleteObject(object: TeamMemberDTO) {
    const dialogRef = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: '270px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.team.teamMembers = this.team.teamMembers?.filter(item => item?.member?.user?.id !== object?.member?.user?.id);
        this.objectDataSource.data = this.team.teamMembers;
      }
    });
  }

}
