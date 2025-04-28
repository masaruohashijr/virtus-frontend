import { EvaluatePlansEditComponent } from './evaluate-plans-edit/evaluate-plans-edit.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CycleDTO } from 'src/app/domain/dto/cycle.dto';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';
import { EvaluatePlansService } from 'src/app/services/rating/evaluate-plans.service';

@Component({
  selector: 'app-evaluate-plans-page',
  templateUrl: './evaluate-plans-page.component.html',
  styleUrls: ['./evaluate-plans-page.component.css']
})
export class EvaluatePlansPageComponent implements OnInit {
  @ViewChild('evaluatePlansEdit') evaluatePlansEditComponent?: EvaluatePlansEditComponent;

  pageObjects: EntityVirtusDTO[] = [];

  objectDataSource: MatTableDataSource<EntityVirtusDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['code', 'name', 'cycle', "actions"];

  cyclesByEntity = new Map();

  showTree = false;
  selectedObject: any;

  constructor(
    public dialog: MatDialog,
    public deleteDialog: MatDialog,
    private _service: EvaluatePlansService,
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
    this._service.listAll(filter).subscribe(response => {
      this.pageObjects = response;
      this.objectDataSource.data = this.pageObjects;
      this.pageObjects.forEach(obj => this.setCyclesByEntity(obj));
      ;
    })
  }

  handlePageEvent(e: PageEvent) {
    this.loadContent(this.filterControl?.value);
  }

  newObject() {

  }

  openEvaluatePlans(object: EntityVirtusDTO) {
    this.selectedObject = object;
    this.showTree = true;

    // ESPERAR O Angular renderizar o componente e depois colapsar
    setTimeout(() => {
      this.evaluatePlansEditComponent?.collapseAllNodes();
    }, 0);
  }

  setCyclesByEntity(entity: EntityVirtusDTO) {
    if (entity.cyclesEntity) {
      const cycles: (CycleDTO | undefined | null)[] = [];
      entity.cyclesEntity.forEach(cycleEntity => {
        cycles.push(cycleEntity.cycle)
        this.cyclesByEntity.set(entity.id, cycles);
        entity.cycleSelected = cycleEntity.cycle;
      });
    }
  }
  
}
