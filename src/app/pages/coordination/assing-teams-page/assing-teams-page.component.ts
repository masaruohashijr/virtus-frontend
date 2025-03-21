import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, debounceTime, distinctUntilChanged, throwError } from 'rxjs';
import { AlertDialogComponent } from 'src/app/components/dialog/alert-dialog/alert-dialog.component';
import { PageResponseDTO } from 'src/app/domain/dto/response/page-response.dto';
import { TeamDTO } from 'src/app/domain/dto/team.dto';
import { CyclesService } from 'src/app/services/configuration/cycles.service';
import { TeamsService } from 'src/app/services/coordination/teams.service';
import { AssingTeamsEditComponent } from './assing-teams-edit/assing-teams-edit.component';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-assing-teams-page',
  templateUrl: './assing-teams-page.component.html',
  styleUrls: ['./assing-teams-page.component.css']
})
export class AssingTeamsPageComponent implements OnInit {

  pageObjects: PageResponseDTO<TeamDTO> = new PageResponseDTO();

  objectDataSource: MatTableDataSource<TeamDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['code', 'name', 'office', 'cycle', "actions"];

  cyclesByEntity = new Map();

  constructor(
    public dialog: MatDialog,
    public errorDialog: MatDialog,
    public deleteDialog: MatDialog,
    private _service: TeamsService,
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
    this._service.getAll('', this.pageObjects.page, this.pageObjects.size).subscribe(response => {
      this.pageObjects = response;
      const teams = this.pageObjects.content;
  
      // Carrega todos os ciclos de forma paralela
      const cycleRequests = teams.map(team =>
        this._cycleService.getAllByEntityId(team.entity.id, 0, 200).pipe(
          catchError(() => of({ content: [] })) // Evita travar se alguma chamada falhar
        )
      );
  
      forkJoin(cycleRequests).subscribe(cycleResponses => {
        cycleResponses.forEach((resp, index) => {
          const team = teams[index];
          this.cyclesByEntity.set(team.entity.id, resp.content);
          if (resp.content.length) {
            team.cycle = resp.content[0];
          }
        });
  
        // Agora que os ciclos foram carregados, aplica o filtro
        const keyword = filter?.toLowerCase() ?? '';
        const filteredData = teams.filter((team: TeamDTO) => {
          const code = team.entity?.code?.toLowerCase() ?? '';
          const name = team.entity?.name?.toLowerCase() ?? '';
          const office = team.office?.name?.toLowerCase() ?? '';
          const cycle = team.cycle?.name?.toLowerCase() ?? '';
  
          return code.includes(keyword)
              || name.includes(keyword)
              || office.includes(keyword)
              || cycle.includes(keyword);
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

  assingTeam(object: TeamDTO) {
    this._service.getSupervisorByTeam(object.entity.id, object.cycle.id)
      .pipe(
        catchError(error => {
          this.errorDialog.open(AlertDialogComponent, {
            width: '350px',
            data: {
              title: "Erro",
              message: error.error?.message ? error.error?.message : "Erro interno no servidor."
            },
          });
          return throwError(error);
        })
      )
      .subscribe((resp) => {
        object.supervisor = resp;
        console.log(object)

        const dialogRef = this.dialog.open(AssingTeamsEditComponent, {
          width: '800px',
          data: object,
        });

        dialogRef.afterClosed().subscribe(result => {
          this.loadContent(this.filterControl?.value);
        });
      });
  }

  setCyclesByEntity(team: TeamDTO) {
    this._cycleService.getAllByEntityId(team?.entity?.id, 0, 200).subscribe((resp) => {
      this.cyclesByEntity.set(team?.entity?.id, resp.content);
      if (resp.content) {
        team.cycle = resp.content[0]
      }
    });
  }
}
