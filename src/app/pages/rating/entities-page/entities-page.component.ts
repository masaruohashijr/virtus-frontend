import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, debounceTime, distinctUntilChanged, tap, throwError } from 'rxjs';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';
import { PageResponseDTO } from 'src/app/domain/dto/response/page-response.dto';
import { EntityVirtusService } from 'src/app/services/rating/entity-virtus.service';
import { EntitiesEditComponent } from './entities-edit/entities-edit.component';
import { ConfirmationDialogComponent } from 'src/app/components/dialog/confirmation-dialog/confirmation-dialog.component';
import { UsersService } from 'src/app/services/administration/users.service';

@Component({
  selector: 'app-entities-page',
  templateUrl: './entities-page.component.html',
  styleUrls: ['./entities-page.component.css']
})
export class EntitiesPageComponent implements OnInit {

  pageObjects: PageResponseDTO<EntityVirtusDTO> = new PageResponseDTO();

  objectDataSource: MatTableDataSource<EntityVirtusDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['code', 'acronym', 'name', 'actualCycle', "actions"];

  constructor(
    @Inject(MatDialog) public dialog: MatDialog,
    @Inject(MatDialog) public deleteDialog: MatDialog,
    private _service: EntityVirtusService,
    public _userService: UsersService,
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
    const dialogRef = this.dialog.open(EntitiesEditComponent, {
      width: '800px',
      data: {
        object: new EntityVirtusDTO(),
        readOnly: false
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadContent(this.filterControl?.value);
    });
  }

  editObject(object: EntityVirtusDTO) {
    this._service.getById(object.id).subscribe(resp => {
      object = resp;

      const dialogRef = this.dialog.open(EntitiesEditComponent, {
        width: '800px',
        data: {
          object: object,
          readOnly: false
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        this.loadContent(this.filterControl?.value);
      });
    });
  }

  viewObject(object: EntityVirtusDTO) {
    this._service.getById(object.id).subscribe(resp => {
      object = resp;

      const dialogRef = this.dialog.open(EntitiesEditComponent, {
        width: '800px',
        data: {
          object: object,
          readOnly: true
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        this.loadContent(this.filterControl?.value);
      });
    });
  }

  deleteObject(object: EntityVirtusDTO) {
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
