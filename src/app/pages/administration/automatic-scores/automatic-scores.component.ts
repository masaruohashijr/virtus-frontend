import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { throwError } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged } from "rxjs/operators";

import { AutomaticScoreDTO } from "src/app/domain/dto/automatic-score.dto";
import { PageResponseDTO } from "src/app/domain/dto/response/page-response.dto";
import { AutomaticScoresService } from "src/app/services/administration/automatic-scores.service";
import { ConfirmationDialogComponent } from "src/app/components/dialog/confirmation-dialog/confirmation-dialog.component";
import { AutomaticScoresEditComponent } from "./automatic-scores-edit/automatic-scores-edit.component";

@Component({
  selector: "app-automatic-scores",
  templateUrl: "./automatic-scores.component.html",
  styleUrls: ["./automatic-scores.component.css"],
})
export class AutomaticScoresComponent implements OnInit {
  pageObjects = new PageResponseDTO<AutomaticScoreDTO>();
  objectDataSource = new MatTableDataSource<AutomaticScoreDTO>();
  objectTableColumns = [
    "id",
    "cnpb",
    "dataReferencia",
    "idComponente",
    "nota",
    "criadoEm",
    "actions",
  ];

  searchForm = this._formBuilder.group({
    filterValue: [""],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private _service: AutomaticScoresService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initFilterListener();
    this.loadScores();
  }

  public get filterControl(): FormControl {
    return this.searchForm.get("filterValue") as FormControl;
  }

  private initFilterListener(): void {
    this.filterControl?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((filter) => this.loadScores(filter ?? ""));
  }

  private loadScores(filter = ""): void {
    const { page = 0, size = 10 } = this.pageObjects;

    this._service
      .getAll(filter, page, size)
      .pipe(
        catchError((error) => {
          console.error("Erro ao carregar notas automáticas:", error);
          this.resetTable();
          return throwError(() => error);
        })
      )
      .subscribe((response) => {
        if (response?.content) {
          this.pageObjects = { ...response };
          this.objectDataSource.data = response.content;
        } else {
          console.warn("Resposta inesperada da API:", response);
          this.resetTable();
        }
      });
  }

  private resetTable(): void {
    this.pageObjects = new PageResponseDTO<AutomaticScoreDTO>();
    this.objectDataSource.data = [];
  }

  handlePageEvent(event: PageEvent): void {
    this.pageObjects.page = event.pageIndex;
    this.pageObjects.size = event.pageSize;
    this.loadScores(this.filterControl?.value || "");
  }

  editObject(score: AutomaticScoreDTO): void {
    this._service.getById(score.id).subscribe((response) => {
      const dialogRef = this._dialog.open(AutomaticScoresEditComponent, {
        width: "800px",
        data: response,
      });

      dialogRef
        .afterClosed()
        .subscribe(() => this.loadScores(this.filterControl?.value || ""));
    });
  }

  deleteObject(score: AutomaticScoreDTO): void {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      width: "270px",
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._service
          .delete(score.id)
          .pipe(
            catchError((error) => {
              console.error("Erro ao excluir nota automática:", error);
              return throwError(() => error);
            })
          )
          .subscribe(() => this.loadScores(this.filterControl?.value || ""));
      }
    });
  }

  newObject(): void {
    const dialogRef = this._dialog.open(AutomaticScoresEditComponent, {
      width: "800px",
      data: {} as AutomaticScoreDTO,
    });

    dialogRef
      .afterClosed()
      .subscribe(() => this.loadScores(this.filterControl?.value || ""));
  }

  calculateAutomaticScores(): void {
    // Aqui pode chamar um endpoint do backend que recalcula as notas automáticas
    console.log("Função de cálculo automático ainda não implementada.");
  }

  openScheduleSyncDialog(): void {
    // Placeholder para uma futura funcionalidade
    console.log("Agendamento de sincronização ainda não implementado.");
  }
}
