import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ElementItemDTO } from 'src/app/domain/dto/element-item.dto';
import { ElementDTO } from 'src/app/domain/dto/element.dto';
import { ElementsItemEditComponent } from '../elements-item-edit/elements-item-edit.component';
import { ConfirmationDialogComponent } from 'src/app/components/dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-elements-item-list',
  templateUrl: './elements-item-list.component.html',
  styleUrls: ['./elements-item-list.component.css']
})
export class ElementsItemListComponent implements OnInit {


  objectDataSource: MatTableDataSource<ElementItemDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['name', 'description', 'author', 'createdAt', "actions"];


  @Input() element!: ElementDTO

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
    console.log(this.element)
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
    if (this.element?.items) {
      if (filter) {
        this.objectDataSource.data = this.element.items.filter(it => it.name && it.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
      } else {
        this.objectDataSource.data = this.element.items;
      }
    }
  }

  newObject() {
    const dialogRef = this.dialog.open(ElementsItemEditComponent, {
      width: '700px',
      data: {
        father: this.element,
        object: new ElementItemDTO()
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.element.items.push(result)
        this.objectDataSource.data = this.element.items;
      }
    });
  }

  editObject(object: ElementDTO) {
    const dialogRef = this.dialog.open(ElementsItemEditComponent, {
      width: '700px',
      data: {
        father: this.element,
        object: object
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.element.items.map(item => {
        if (item.id == result.id) {
          item = result;
        }
      })
      this.objectDataSource.data = this.element.items;
    });
  }

  deleteObject(object: ElementDTO) {
    const dialogRef = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: '270px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.element.items = this.element.items?.filter(item => item.id !== object.id);
        this.objectDataSource.data = this.element.items;
      }
    });
  }

}
