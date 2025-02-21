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

@Component({
  selector: 'app-evaluate-plans-page',
  templateUrl: './evaluate-plans-page.component.html',
  styleUrls: ['./evaluate-plans-page.component.css']
})
export class EvaluatePlansPageComponent implements OnInit {

  pageObjects: PageResponseDTO<DistributeActivitiesDTO> = new PageResponseDTO();

  objectDataSource: MatTableDataSource<DistributeActivitiesDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['code', 'name', 'cycle', 'jurisdiction', "actions"];

  cyclesByEntity = new Map();

  showTree = false;

  constructor(
    public dialog: MatDialog,
    public deleteDialog: MatDialog,
    private _service: DistributeActivitiesService,
    private _cycleService: CyclesService,
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
    this._service.getAllDistributeActivities(filter, this.pageObjects.page, this.pageObjects.size).subscribe(response => {
      this.pageObjects = response;
      this.objectDataSource.data = this.pageObjects.content;
      this.objectDataSource.data.forEach(dist => {
        this.setCyclesByEntity(dist);
      });
    })
  }

  handlePageEvent(e: PageEvent) {
    this.pageObjects.totalElements = e.length;
    this.pageObjects.size = e.pageSize;
    this.pageObjects.page = e.pageIndex;
    this.loadContent(this.filterControl?.value);
  }

  newObject() {

  }

  openEvaluatePlans(object: any) {

  }

  setCyclesByEntity(distributeActivities: DistributeActivitiesDTO) {
    if (distributeActivities.entityId) {
      this._cycleService.getAllByEntityId(distributeActivities.entityId, 0, 200).subscribe((resp) => {
        this.cyclesByEntity.set(distributeActivities.entityId, resp.content);
        if (resp.content) {
          distributeActivities.cycle = resp.content[0]
        }
      });
    }
  }
}
