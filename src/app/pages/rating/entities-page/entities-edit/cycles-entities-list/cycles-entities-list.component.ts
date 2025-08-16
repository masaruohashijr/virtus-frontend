import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CycleEntityDTO } from 'src/app/domain/dto/cycle-entity.dto';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';
import { CyclesEntitiesEditComponent } from '../cycles-entities-edit/cycles-entities-edit.component';
import { ConfirmationDialogComponent } from 'src/app/components/dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-cycles-entities-list',
  templateUrl: './cycles-entities-list.component.html',
  styleUrls: ['./cycles-entities-list.component.css']
})
export class CyclesEntitiesListComponent implements OnInit {

  @Input() entity!: EntityVirtusDTO;
  @Input() readOnly: boolean = false;

  objectDataSource: MatTableDataSource<CycleEntityDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['cycle', 'averageType', 'startsAt', 'endsAt', 'actions'];

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
    console.log(this.entity)
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
    if (this.entity?.cyclesEntity) {
      if (filter) {
        this.objectDataSource.data = this.entity.cyclesEntity.filter(it => it.cycle?.name && it.cycle?.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
      } else {
        this.objectDataSource.data = this.entity.cyclesEntity;
      }
    }
  }

  newObject() {
    const dialogRef = this.dialog.open(CyclesEntitiesEditComponent, {
      width: '700px',
      data: {
        father: this.entity,
        object: new CycleEntityDTO()
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.entity.cyclesEntity.push(result)
        this.objectDataSource.data = this.entity.cyclesEntity;
      }
    });
  }

  editObject(object: CycleEntityDTO) {
    const dialogRef = this.dialog.open(CyclesEntitiesEditComponent, {
      width: '700px',
      data: {
        father: this.entity,
        object: object
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.entity.cyclesEntity.map(item => {
        if (item.id == result.id) {
          item = result;
        }
      })
      this.objectDataSource.data = this.entity.cyclesEntity;
    });
  }

  deleteObject(object: CycleEntityDTO) {
    const dialogRef = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: '270px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.entity.cyclesEntity = this.entity.cyclesEntity?.filter(item => item.id !== object.id);
        this.objectDataSource.data = this.entity.cyclesEntity;
      }
    });
  }

}
