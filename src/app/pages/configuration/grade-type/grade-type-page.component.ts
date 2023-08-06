import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { PageResponseDTO } from 'src/app/domain/dto/response/page-response.dto';
import { GradeTypeService } from 'src/app/services/configuration/grade-type.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GradeTypeEditComponent } from './grade-type-edit/grade-type-edit.component';
import { GradeTypeDTO } from 'src/app/domain/dto/type-of-note.dto';
import { ConfirmationDialogComponent } from 'src/app/components/dialog/confirmation-dialog/confirmation-dialog.component';
import { tap, catchError, throwError, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-grade-type-page',
  templateUrl: './grade-type-page.component.html',
  styleUrls: ['./grade-type-page.component.css']
})
export class GradeTypePageComponent implements OnInit {

  pageObjects: PageResponseDTO<GradeTypeDTO> = new PageResponseDTO();

  objectDataSource: MatTableDataSource<GradeTypeDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['id', 'name', 'description', 'reference', 'letter', 'letterColor', "actions"];

  constructor(
    public dialog: MatDialog,
    public deleteDialog: MatDialog,
    private _typeOfNoteService: GradeTypeService,
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
    this._typeOfNoteService.getAll(filter, this.pageObjects.page, this.pageObjects.size).subscribe(response => {
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
    const dialogRef = this.dialog.open(GradeTypeEditComponent, {
      width: '800px',
      data: new GradeTypeDTO(),
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadContent(this.filterControl?.value);
    });
  }

  editObject(object: GradeTypeDTO) {
    const dialogRef = this.dialog.open(GradeTypeEditComponent, {
      width: '800px',
      data: object,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadContent(this.filterControl?.value);
    });
  }

  deleteObject(object: GradeTypeDTO) {
    const dialogRef = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: '270px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._typeOfNoteService.delete(object.id).pipe(
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
