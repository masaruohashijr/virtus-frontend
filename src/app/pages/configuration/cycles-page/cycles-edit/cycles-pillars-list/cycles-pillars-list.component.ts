import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/components/dialog/confirmation-dialog/confirmation-dialog.component';
import { CyclePillarDTO } from 'src/app/domain/dto/cycle-pillar.dto';
import { CycleDTO } from 'src/app/domain/dto/cycle.dto';
import { CyclesPillarsEditComponent } from '../cycles-pillars-edit/cycles-pillars-edit.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-cycles-pillars-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './cycles-pillars-list.component.html',
  styleUrls: ['./cycles-pillars-list.component.css']
})
export class CyclesPillarsListComponent implements OnInit {

  @Input() cycle!: CycleDTO;

  objectDataSource: MatTableDataSource<CyclePillarDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['name', 'author', 'createdAt', "actions"];

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
    console.log(this.cycle)
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
    if (this.cycle?.cyclePillars) {
      if (filter) {
        this.objectDataSource.data = this.cycle?.cyclePillars.filter(it => it.pillar?.name && it.pillar?.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
      } else {
        this.objectDataSource.data = this.cycle?.cyclePillars;
      }
    }
  }

  newObject() {
    const dialogRef = this.dialog.open(CyclesPillarsEditComponent, {
      width: '700px',
      data: {
        father: this.cycle,
        object: new CyclePillarDTO()
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cycle.cyclePillars.push(result)
        this.objectDataSource.data = this.cycle.cyclePillars;
      }
    });
  }

  editObject(object: CyclePillarDTO) {
    const dialogRef = this.dialog.open(CyclesPillarsEditComponent, {
      width: '700px',
      data: {
        father: this.cycle,
        object: object
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cycle.cyclePillars.map(item => {
        if (item.id == result.id) {
          item = result;
        }
      })
      this.objectDataSource.data = this.cycle.cyclePillars;
    });
  }

  deleteObject(object: CyclePillarDTO) {
    const dialogRef = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: '270px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.cycle.cyclePillars = this.cycle.cyclePillars?.filter(item => item.id !== object.id);
        this.objectDataSource.data = this.cycle.cyclePillars;
      }
    });
  }

}
