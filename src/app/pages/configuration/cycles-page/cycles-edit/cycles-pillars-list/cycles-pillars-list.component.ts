import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatIconModule }       from '@angular/material/icon';
import { MatButtonModule }     from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { CycleDTO } from 'src/app/domain/dto/cycle.dto';
import { CyclePillarDTO } from 'src/app/domain/dto/cycle-pillar.dto';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CyclesPillarsEditComponent } from '../cycles-pillars-edit/cycles-pillars-edit.component';
import { ConfirmationDialogComponent } from 'src/app/components/dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-cycles-pillars-list',
  templateUrl: './cycles-pillars-list.component.html',
  styleUrls: ['./cycles-pillars-list.component.css']
})
export class CyclesPillarsListComponent implements OnInit {
  @Input() cycle!: CycleDTO;

  objectDataSource = new MatTableDataSource<CyclePillarDTO>();
  objectTableColumns: string[] = ['name', 'author', 'createdAt', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder
  ) {}

  searchForm = this._formBuilder.group({ filterValue: [''] });
  filterControl = this.searchForm.get('filterValue');

  ngOnInit(): void {
    this.loadContent('');
    this.filterControl?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(filterValue => this.loadContent(filterValue || ''));
  }

  ngAfterViewInit(): void {
    this.objectDataSource.sort = this.sort;        // necessário se usar mat-sort-header
    this.objectDataSource.paginator = this.paginator;
  }

  loadContent(filter: string) {
    const items = this.cycle?.cyclePillars ?? [];
    this.objectDataSource.data = filter
      ? items.filter(it => it.pillar?.name?.toLowerCase().includes(filter.toLowerCase()))
      : items;
  }

  newObject() {
    const dialogRef = this.dialog.open(CyclesPillarsEditComponent, {
      width: '700px',
      data: { father: this.cycle, object: new CyclePillarDTO() },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cycle.cyclePillars.push(result);
        this.objectDataSource.data = this.cycle.cyclePillars;
      }
    });
  }

  editObject(object: CyclePillarDTO) {
    const dialogRef = this.dialog.open(CyclesPillarsEditComponent, {
      width: '700px',
      data: { father: this.cycle, object },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const idx = this.cycle.cyclePillars.findIndex(i => i.id === result.id);
      if (idx > -1) this.cycle.cyclePillars[idx] = result;
      this.objectDataSource.data = [...this.cycle.cyclePillars];
    });
  }

  deleteObject(object: CyclePillarDTO) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '270px',
    });

    dialogRef.afterClosed().subscribe((ok: boolean) => {
      if (ok) {
        this.cycle.cyclePillars = this.cycle.cyclePillars.filter(i => i.id !== object.id);
        this.objectDataSource.data = this.cycle.cyclePillars;
      }
    });
  }
}
