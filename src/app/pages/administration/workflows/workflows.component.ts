import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { PageResponseDTO } from 'src/app/domain/dto/response/page-response.dto';
import { WorkflowDTO } from 'src/app/domain/dto/workflow.dto';
import { WorkflowsService } from 'src/app/services/administration/workflows.service';
import { WorkflowsEditComponent } from './workflows-edit/workflows-edit.component';
import { ConfirmationDialogComponent } from 'src/app/components/dialog/confirmation-dialog/confirmation-dialog.component';
import { tap } from 'rxjs/internal/operators/tap';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.css']
})
export class WorkflowsComponent implements OnInit {

  pageObjects: PageResponseDTO<WorkflowDTO> = new PageResponseDTO();

  objectDataSource: MatTableDataSource<WorkflowDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['id', 'name', 'entity','startAt', 'endAt', 'author', 'createdAt', "actions"];

  constructor(
    public dialog: MatDialog,
    public deleteDialog: MatDialog,
    private _service: WorkflowsService,
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

  loadContent(filter: any) {
    this._service.getAll(filter, this.pageObjects.page, this.pageObjects.size).subscribe(response => {
      this.pageObjects = response;
      this.objectDataSource.data = this.pageObjects.content;
    })
  }

  handlePageEvent(e: PageEvent) {
    this.pageObjects.totalElements = e.length;
    this.pageObjects.size = e.pageSize;
    this.pageObjects.page = e.pageIndex;
    this.loadContent(this.filterControl?.value);
  }

  newObject() {
    const dialogRef = this.dialog.open(WorkflowsEditComponent, {
      width: '800px',
      data: new WorkflowDTO(),
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadContent(this.filterControl?.value);
    });
  }

  editObject(object: WorkflowDTO) {
    this._service.getById(object.id).subscribe(resp => {
      object = resp;

      const dialogRef = this.dialog.open(WorkflowsEditComponent, {
        width: '800px',
        data: object,
      });

      dialogRef.afterClosed().subscribe(result => {
        this.loadContent(this.filterControl?.value);
      });
    });
  }

  deleteObject(object: WorkflowDTO) {
    const dialogRef = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: '270px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._service.delete(object.id).pipe(
          tap(resp => {
            this.loadContent(this.filterControl?.value);
          }),
          catchError(error => {
            console.error(error);
            return throwError(error);
          })
        ).subscribe();
      }
    });
  }

}
