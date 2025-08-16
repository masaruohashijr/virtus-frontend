import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PillarComponentDTO } from 'src/app/domain/dto/pillar-component.dto';
import { PillarDTO } from 'src/app/domain/dto/pillar.dto';
import { PillarsComponentEditComponent } from '../pillars-component-edit/pillars-component-edit.component';
import { ConfirmationDialogComponent } from 'src/app/components/dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-pillars-component-list',
  templateUrl: './pillars-component-list.component.html',
  styleUrls: ['./pillars-component-list.component.css']
})
export class PillarsComponentListComponent implements OnInit {

  @Input() pillar!: PillarDTO;

  objectDataSource: MatTableDataSource<PillarComponentDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['name', 'averageType', 'standardWeight', 'author', 'createdAt', "actions"];

  constructor(
    @Inject(MatDialogRef) public dialog: MatDialog,
    @Inject(MatDialogRef) public deleteDialog: MatDialog,
    private _formBuilder: FormBuilder) { }

  searchForm = this._formBuilder.group({
    filterValue: ['']
  })
  filterControl = this.searchForm.get('filterValue');

  ngOnInit(): void {
    this.loadContent('');
    console.log(this.pillar)
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
    if (this.pillar?.components) {
      if (filter) {
        this.objectDataSource.data = this.pillar.components.filter(it => it.component?.name && it.component?.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
      } else {
        this.objectDataSource.data = this.pillar.components;
      }
    }
  }

  newObject() {
    const dialogRef = this.dialog.open(PillarsComponentEditComponent, {
      width: '700px',
      data: {
        father: this.pillar,
        object: new PillarComponentDTO()
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pillar.components.push(result)
        this.objectDataSource.data = this.pillar.components;
      }
    });
  }

  editObject(object: PillarComponentDTO) {
    const dialogRef = this.dialog.open(PillarsComponentEditComponent, {
      width: '700px',
      data: {
        father: this.pillar,
        object: object
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.pillar.components.map(item => {
        if (item.id == result.id) {
          item = result;
        }
      })
      this.objectDataSource.data = this.pillar.components;
    });
  }

  deleteObject(object: PillarComponentDTO) {
    const dialogRef = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: '270px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pillar.components = this.pillar.components?.filter(item => item.id !== object.id);
        this.objectDataSource.data = this.pillar.components;
      }
    });
  }

}
