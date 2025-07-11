import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { throwError } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged } from "rxjs/operators";

import { ConfirmationDialogComponent } from "src/app/components/dialog/confirmation-dialog/confirmation-dialog.component";
import { IndicatorDTO } from "src/app/domain/dto/indicator.dto";
import { PageResponseDTO } from "src/app/domain/dto/response/page-response.dto";
import { IndicatorsService } from "src/app/services/configuration/indicators.service";
import { IndicatorsEditComponent } from "./indicators-edit/indicators-edit.component";
import { PlainMessageDialogComponent } from "../../administration/plain-message/plain-message-dialog.component";

@Component({
  selector: "app-indicators",
  templateUrl: "./indicators-page.component.html",
  styleUrls: ["./indicators-page.component.css"],
})
export class IndicatorsPageComponent implements OnInit {
  pageObjects = new PageResponseDTO<IndicatorDTO>();
  objectDataSource = new MatTableDataSource<IndicatorDTO>();
  objectTableColumns = [
    "id",
    "indicatorAcronym",
    "indicatorName",
    "actions",
  ];

  searchForm = this._formBuilder.group({
    filterValue: [""],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private _service: IndicatorsService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initFilterListener();
    this.loadIndicators();
  }

  private get filterControl() {
    return this.searchForm.get("filterValue");
  }

  private initFilterListener(): void {
    this.filterControl?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((filter) => this.loadIndicators(filter ?? ""));
  }

  private loadIndicators(filter = ""): void {
    const { page = 0, size = 10 } = this.pageObjects;

    this._service
      .getAll(filter, page, size)
      .pipe(
        catchError((error) => {
          console.error("Erro ao carregar indicadores:", error);
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
    this.pageObjects = new PageResponseDTO<IndicatorDTO>();
    this.objectDataSource.data = [];
  }

  handlePageEvent(event: PageEvent): void {
    this.pageObjects.page = event.pageIndex;
    this.pageObjects.size = event.pageSize;
    this.loadIndicators(this.filterControl?.value || "");
  }

  newObject(): void {
    const dialogRef = this._dialog.open(IndicatorsEditComponent, {
      width: "800px",
      data: new IndicatorDTO(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadIndicators(this.filterControl?.value || "");
    });
  }

  editObject(indicator: IndicatorDTO): void {
    const dialogRef = this._dialog.open(IndicatorsEditComponent, {
      width: "800px",
      data: indicator,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadIndicators(this.filterControl?.value || "");
    });
  }

  deleteObject(indicator: IndicatorDTO): void {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      width: "270px",
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._service
          .delete(indicator.id)
          .pipe(
            catchError((error) => {
              console.error("Erro ao excluir indicador:", error);
              return throwError(() => error);
            })
          )
          .subscribe(() =>
            this.loadIndicators(this.filterControl?.value || "")
          );
      }
    });
  }

  syncIndicators(): void {
    this._service.syncIndicators().subscribe({
      next: () => {
        this._dialog.open(PlainMessageDialogComponent, {
          width: "350px",
          data: {
            title: "Sincronização",
            message: "Sincronização realizada com sucesso!",
          },
        });
        this.loadIndicators(this.filterControl?.value || "");
      },
      error: (err) => {
        console.error("Erro ao sincronizar indicadores:", err);
        this._dialog.open(PlainMessageDialogComponent, {
          width: "350px",
          data: {
            title: "Erro",
            message: "Erro ao sincronizar. Verifique o console.",
          },
        });
      },
    });
  }
}
