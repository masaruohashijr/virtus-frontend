import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';
import { PlanDTO } from 'src/app/domain/dto/plan.dto';
import { PlansEditComponent } from '../plans-edit/plans-edit.component';
import { ConfirmationDialogComponent } from 'src/app/components/dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-plans-list',
  templateUrl: './plans-list.component.html',
  styleUrls: ['./plans-list.component.css']
})
export class PlansListComponent implements OnInit {

  @Input() entity!: EntityVirtusDTO;

  objectDataSource: MatTableDataSource<PlanDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['cnpb', 'modality', 'guaranteeResource', 'actions'];

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
    if (this.entity?.plans) {
      if (filter) {
        this.objectDataSource.data = this.entity.plans.filter(it => it.name?.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
          || it.cnpb?.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
          || it.modality?.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
      } else {
        this.objectDataSource.data = this.entity.plans;
      }
    }
  }

  newObject() {
    const dialogRef = this.dialog.open(PlansEditComponent, {
      width: '700px',
      data: {
        father: this.entity,
        object: new PlanDTO()
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.entity.plans.push(result)
        this.objectDataSource.data = this.entity.plans;
      }
    });
  }

  editObject(object: PlanDTO) {
    const dialogRef = this.dialog.open(PlansEditComponent, {
      width: '700px',
      data: {
        father: this.entity,
        object: object
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.entity.plans.map(item => {
        if (item.id == result.id) {
          item = result;
        }
      })
      this.objectDataSource.data = this.entity.plans;
    });
  }

  deleteObject(object: PlanDTO) {
    const dialogRef = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: '270px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.entity.plans = this.entity.plans?.filter(item => item.id !== object.id);
        this.objectDataSource.data = this.entity.plans;
      }
    });
  }

  formatToThousands(value: number){
    if(!value){
      return "";
    }
    return value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'decimal' }) + " Milhares"
  }

}
