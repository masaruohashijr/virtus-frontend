import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { ActivityDTO } from 'src/app/domain/dto/activity.dto';
import { ActivitiesEditComponent } from '../activities-edit/activities-edit.component';
import { ConfirmationDialogComponent } from 'src/app/components/dialog/confirmation-dialog/confirmation-dialog.component';
import { RoleDTO } from 'src/app/domain/dto/role.dto';
import { WorkflowDTO } from 'src/app/domain/dto/workflow.dto';

@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.css']
})
export class ActivitiesListComponent implements OnInit {

  @Input() workflow!: WorkflowDTO;

  objectDataSource: MatTableDataSource<ActivityDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['action', 'originStatus', 'destinationStatus', 'startAt', 'endAt', 'roles', "actions"];

  constructor(
    @Inject(MatDialog) public dialog: MatDialog,
    @Inject(MatDialog) public deleteDialog: MatDialog,
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

  loadContent(filter: string | null) {
    if (this.workflow?.activities) {
      if (filter) {
        this.objectDataSource.data = this.workflow?.activities.filter(it => it?.action?.name?.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
      } else {
        this.objectDataSource.data = this.workflow?.activities;
      }
    }
  }

  newObject() {
    const dialogRef = this.dialog.open(ActivitiesEditComponent, {
      width: '700px',
      data: {
        father: this.workflow,
        object: new ActivityDTO()
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.workflow?.activities?.push(result)
        this.objectDataSource.data = this.workflow.activities;
      }
    });
  }

  editObject(object: ActivityDTO) {
    const dialogRef = this.dialog.open(ActivitiesEditComponent, {
      width: '700px',
      data: {
        father: this.workflow,
        object: object
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.workflow.activities.map(item => {
        if (item.id == result?.id) {
          item = result;
        }
      })
      this.objectDataSource.data = this.workflow.activities;
    });
  }

  deleteObject(object: ActivityDTO) {
    const dialogRef = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: '270px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.workflow.activities = this.workflow.activities?.filter(item => item.id !== object.id);
        this.objectDataSource.data = this.workflow.activities;
      }
    });
  }

  parseRolesToString(roles: RoleDTO[]) {
    return roles?.map(role => role.name).join(', ');
  }

}
