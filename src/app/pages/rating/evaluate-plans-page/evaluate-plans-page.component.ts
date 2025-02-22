import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';
import { DistributeActivitiesDTO } from 'src/app/domain/dto/distribute-activities-dto';
import { DistributeActivitiesTreeDTO } from 'src/app/domain/dto/distribute-activities-tree-dto';
import { ProductComponentDTO } from 'src/app/domain/dto/product-component.dto';
import { DistributeActivitiesService } from 'src/app/services/coordination/distribute-activities.service';
import { HistoryService } from 'src/app/services/coordination/history.service';
import { ActivitiesByProductComponentRequestDto } from '../../coordination/distribute-activities/distribute-activities-edit/distribute-activities-edit.component';
import { catchError, debounceTime, distinctUntilChanged, tap, throwError } from 'rxjs';
import { AlertDialogComponent } from 'src/app/components/dialog/alert-dialog/alert-dialog.component';
import { AuditorDTO } from 'src/app/domain/dto/auditor.dto';
import { ConfigPlansComponent } from '../../coordination/distribute-activities/config-plans-edit/config-plans-edit.component';
import { HistoryViewComponent } from '../../coordination/distribute-activities/history-view/history-view.component';
import { History } from 'src/app/domain/dto/history.dto';
import { PageResponseDTO } from 'src/app/domain/dto/response/page-response.dto';
import { MatTableDataSource } from '@angular/material/table';
import { CyclesService } from 'src/app/services/configuration/cycles.service';
import { FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';
import { EvaluatePlansService } from 'src/app/services/rating/evaluate-plans.service';
import { CycleDTO } from 'src/app/domain/dto/cycle.dto';

@Component({
  selector: 'app-evaluate-plans-page',
  templateUrl: './evaluate-plans-page.component.html',
  styleUrls: ['./evaluate-plans-page.component.css']
})
export class EvaluatePlansPageComponent implements OnInit {

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
    this._service.listAll().subscribe(response => {
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
