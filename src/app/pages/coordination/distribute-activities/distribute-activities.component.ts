import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DistributeActivitiesDTO } from 'src/app/domain/dto/distribute-activities-dto';
import { PageResponseDTO } from 'src/app/domain/dto/response/page-response.dto';
import { CyclesService } from 'src/app/services/configuration/cycles.service';
import { DistributeActivitiesService } from 'src/app/services/coordination/distribute-activities.service';
import { DistributeActivitiesEditComponent } from './distribute-activities-edit/distribute-activities-edit.component';

@Component({
  selector: 'app-distribute-activities',
  templateUrl: './distribute-activities.component.html',
  styleUrls: ['./distribute-activities.component.css']
})
export class DistributeActivitiesComponent implements OnInit {

  pageObjects: PageResponseDTO<DistributeActivitiesDTO> = new PageResponseDTO();

  objectDataSource: MatTableDataSource<DistributeActivitiesDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['code', 'name', 'cycle', 'jurisdiction', "actions"];

  cyclesByEntity = new Map();

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

  distributeActivities(object: any) {
    const dialogRef = this.dialog.open(DistributeActivitiesEditComponent, {
      width: '100%',
      data: object,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadContent(this.filterControl?.value);
    });
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
