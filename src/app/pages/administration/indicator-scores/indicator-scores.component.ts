import { MatSnackBar } from "@angular/material/snack-bar";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { throwError } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { IndicatorScoreDTO } from "../../../domain/dto/indicator-score.dto";

import { ConfirmationDialogComponent } from "src/app/components/dialog/confirmation-dialog/confirmation-dialog.component";
import { PageResponseDTO } from "src/app/domain/dto/response/page-response.dto";
import { IndicatorScoresService } from "src/app/services/administration/indicator-scores.service";
import { IndicatorScoresEditComponent } from "./indicator-scores-edit/indicator-scores-edit.component";
import { SyncDialogComponent } from "./sync-dialog/sync-dialog.component";
import { PlainMessageDialogComponent } from "../plain-message/plain-message-dialog.component";

@Component({
  selector: "app-indicator-scores",
  templateUrl: "./indicator-scores.component.html",
  styleUrls: ["./indicator-scores.component.css"],
})
export class IndicatorScoresComponent implements OnInit {
  pageObjects = new PageResponseDTO<IndicatorScoreDTO>();
  objectDataSource = new MatTableDataSource<IndicatorScoreDTO>();
  objectTableColumns = [
    "id",
    "cnpb",
    "referenceDate",
    "indicatorSigla",
    "score",
    "createdAt",
    "actions",
  ];

  searchForm = this._formBuilder.group({
    filterValue: [""],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private _service: IndicatorScoresService,
    @Inject(MatDialog) private _dialog: MatDialog,
    @Inject(MatSnackBar) private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initFilterListener();
    this.loadScores("");
  }

  private get filterControl() {
    return this.searchForm.get("filterValue");
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
          console.error("Erro ao carregar notas de indicadores:", error);
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
    this.pageObjects = new PageResponseDTO<IndicatorScoreDTO>();
    this.objectDataSource.data = [];
  }

  handlePageEvent(event: PageEvent): void {
    this.pageObjects.page = event.pageIndex;
    this.pageObjects.size = event.pageSize;
    this.loadScores(this.filterControl?.value || "");
  }

  editObject(score: IndicatorScoreDTO): void {
    this._service.getById(score.id).subscribe((response) => {
      const dialogRef = this._dialog.open(IndicatorScoresEditComponent, {
        width: "800px",
        data: response,
      });

      dialogRef
        .afterClosed()
        .subscribe(() => this.loadScores(this.filterControl?.value || ""));
    });
  }

  deleteObject(score: IndicatorScoreDTO): void {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      width: "270px",
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._service
          .delete(score.id)
          .pipe(
            catchError((error) => {
              console.error("Erro ao excluir nota de indicador:", error);
              return throwError(() => error);
            })
          )
          .subscribe(() => this.loadScores(this.filterControl?.value || ""));
      }
    });
  }

  newObject(): void {
    const dialogRef = this._dialog.open(IndicatorScoresEditComponent, {
      width: "800px",
      data: {} as IndicatorScoreDTO,
    });

    dialogRef
      .afterClosed()
      .subscribe(() => this.loadScores(this.filterControl?.value || ""));
  }

  openSyncDialog(): void {
    this._service.fetchLastReference().subscribe({
      next: (result: any) => {
        const ultimaReferencia = result.referenceDate || null;
        const dialogRef = this._dialog.open(SyncDialogComponent, {
          width: "400px",
          data: { ultimaReferencia },
        });

        dialogRef.afterClosed().subscribe((referenceDate) => {
          if (referenceDate) {
            this.loadScores(this.filterControl?.value || "");

            this._snackBar.open(
              `Notas da Referência ${referenceDate} foram sincronizadas com sucesso.`,
              "Fechar",
              {
                duration: 3000,
              }
            );
          }
        });
      },
      error: (err) => {
        console.error("Erro ao buscar última referência:", err);
        this._dialog.open(PlainMessageDialogComponent, {
          width: "350px",
          data: {
            title: "Erro",
            message: "Erro ao buscar última referência. Verifique o console.",
          },
        });
      },
    });
  }
}
