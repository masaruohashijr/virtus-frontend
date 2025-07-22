import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ComponentElementDTO } from 'src/app/domain/dto/component-element.dto';
import { ComponentDTO } from 'src/app/domain/dto/components.dto';
import { ComponentsElementsEditComponent } from '../components-elements-edit/components-elements-edit.component';
import { ConfirmationDialogComponent } from 'src/app/components/dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-components-elements-list',
  templateUrl: './components-elements-list.component.html',
  styleUrls: ['./components-elements-list.component.css']
})
export class ComponentsElementsListComponent implements OnInit {

  objectDataSource: MatTableDataSource<ComponentElementDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['elementName', 'gradeType', 'createdAt', "actions"];


  @Input() component!: ComponentDTO

  constructor(
    public dialog: MatDialog,
    public deleteDialog: MatDialog,
    private _formBuilder: FormBuilder) { }

  searchForm = this._formBuilder.group({
    filterValue: ['']
  })
  filterControl = this.searchForm.get('filterValue');

  ngOnInit(): void {
    this.loadContent('');
    console.log(this.component)
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
    if (this.component?.componentElements) {
      if (filter) {
        this.objectDataSource.data = this.component?.componentElements.filter(it => it.element?.name && it.element?.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
      } else {
        this.objectDataSource.data = this.component?.componentElements;
      }
    }
  }

  newObject() {
    const dialogRef = this.dialog.open(ComponentsElementsEditComponent, {
      width: '700px',
      data: {
        father: this.component,
        object: new ComponentElementDTO()
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.component.componentElements.push(result)
        this.objectDataSource.data = this.component.componentElements;
      }
    });
  }

  editObject(object: ComponentElementDTO) {
    const dialogRef = this.dialog.open(ComponentsElementsEditComponent, {
      width: '700px',
      data: {
        father: this.component,
        object: object
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.component.componentElements.map(item => {
        if (item.id == result.id) {
          item = result;
        }
      })
      this.objectDataSource.data = this.component.componentElements;
    });
  }

  deleteObject(object: ComponentElementDTO) {
    const dialogRef = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: '270px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.component.componentElements = this.component.componentElements?.filter(item => item.id !== object.id);
        this.objectDataSource.data = this.component.componentElements;
      }
    });
  }

}
