import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { ConfirmationDialogComponent } from 'src/app/components/dialog/confirmation-dialog/confirmation-dialog.component';
import { PageResponseDTO } from 'src/app/domain/dto/response/page-response.dto';
import { IndicatorsService } from 'src/app/services/administration/indicators.service';
import { IndicatorsEditComponent } from './indicators-edit/indicators-edit.component';
import { IndicatorDTO } from 'src/app/domain/dto/indicator.dto';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.css']
})
export class IndicatorsComponent implements OnInit {

  pageObjects = new PageResponseDTO<IndicatorDTO>();
  objectDataSource = new MatTableDataSource<IndicatorDTO>();
  objectTableColumns = ['id', 'indicatorAcronym', 'indicatorName', 'indicatorDescription', 'actions'];

  searchForm = this._formBuilder.group({
    filterValue: ['']
  });

  constructor(
    private _formBuilder: FormBuilder,
    private _service: IndicatorsService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initFilterListener();
    this.loadIndicators();
    
  }

  private get filterControl() {
    return this.searchForm.get('filterValue');
  }

  private initFilterListener(): void {
    this.filterControl?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(filter => this.loadIndicators(filter ?? ''));
  }

  private loadIndicators(filter = ''): void {
    const { page = 0, size = 10 } = this.pageObjects;

    this._service.getAll(filter, page, size).pipe(
      catchError(error => {
        console.error('Erro ao carregar indicadores:', error);
        this.resetTable();
        return throwError(() => error);
      })
    ).subscribe(response => {
      if (response?.content) {
        this.pageObjects = { ...response };
        this.objectDataSource.data = response.content;
      } else {
        console.warn('Resposta inesperada da API:', response);
        this.resetTable();
      }
    });
  }

  private resetTable(): void {
    this.pageObjects = new PageResponseDTO<IndicatorDTO>();
    this.objectDataSource.data = [];
  }

  handlePageEvent(event: PageEvent): void {
    this.pageObjects.page = event.pageIndex;
    this.pageObjects.size = event.pageSize;
    this.loadIndicators(this.filterControl?.value || '');
  }

  newObject(): void {
    const dialogRef = this._dialog.open(IndicatorsEditComponent, {
      width: '800px',
      data: {} as IndicatorDTO
    });

    dialogRef.afterClosed().subscribe(() => this.loadIndicators(this.filterControl?.value || ''));
  }

  editObject(indicator: IndicatorDTO): void {
    this._service.getById(indicator.id).subscribe(response => {
      const dialogRef = this._dialog.open(IndicatorsEditComponent, {
        width: '800px',
        data: response
      });

      dialogRef.afterClosed().subscribe(() => this.loadIndicators(this.filterControl?.value || ''));
    });
  }

  deleteObject(indicator: IndicatorDTO): void {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      width: '270px'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this._service.delete(indicator.id).pipe(
          catchError(error => {
            console.error('Erro ao excluir indicador:', error);
            return throwError(() => error);
          })
        ).subscribe(() => this.loadIndicators(this.filterControl?.value || ''));
      }
    });
  }
}
