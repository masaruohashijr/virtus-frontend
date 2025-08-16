import { Component, Inject, OnInit } from '@angular/core';
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
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    @Inject(MatDialog) public dialog: MatDialog,
    @Inject(MatDialog) public deleteDialog: MatDialog,
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
    this._service.getAllDistributeActivities('', this.pageObjects.page, this.pageObjects.size).subscribe(response => {
      this.pageObjects = response;
      const objects = this.pageObjects.content;
  
      // Criar lista de chamadas para pegar ciclos
      const cycleRequests = objects.map(obj =>
        this._cycleService.getAllByEntityId(obj.entityId, 0, 200).pipe(
          catchError(() => of({ content: [] }))
        )
      );
  
      forkJoin(cycleRequests).subscribe(cycleResponses => {
        cycleResponses.forEach((resp, index) => {
          const obj = objects[index];
          this.cyclesByEntity.set(obj.entityId, resp.content);
          if (resp.content?.length) {
            obj.cycle = resp.content[0];
          }
        });
  
        // Agora aplicamos o filtro após os ciclos estarem carregados
        const keyword = (filter ?? '').toLowerCase();
  
        const filteredData = objects.filter((item: DistributeActivitiesDTO) => {
          const code = item.code?.toLowerCase() ?? '';
          const name = item.name?.toLowerCase() ?? '';
          const jurisdiction = item.acronym?.toLowerCase() ?? '';
          const cycleName = item.cycle?.name?.toLowerCase() ?? '';
  
          return code.includes(keyword)
            || name.includes(keyword)
            || jurisdiction.includes(keyword)
            || cycleName.includes(keyword);
        });
  
        this.objectDataSource.data = filteredData;
      });
    });
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
