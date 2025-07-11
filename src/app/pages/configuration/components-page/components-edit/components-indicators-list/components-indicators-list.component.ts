import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { ComponentDTO } from "src/app/domain/dto/components.dto";
import { IndicatorDTO } from "src/app/domain/dto/indicator.dto";
import { ConfirmationDialogComponent } from "src/app/components/dialog/confirmation-dialog/confirmation-dialog.component";
import { ComponentIndicatorDTO } from "src/app/domain/dto/component-indicator.dto";
import { ComponentsIndicatorsEditComponent } from "../components-indicators-edit/components-indicators-edit.component";

@Component({
  selector: "app-components-indicators-list",
  templateUrl: "./components-indicators-list.component.html",
  styleUrls: ["./components-indicators-list.component.css"],
})
export class ComponentsIndicatorsListComponent implements OnInit {
  @Input() component!: ComponentDTO;
  objectDataSource: MatTableDataSource<ComponentIndicatorDTO> =
    new MatTableDataSource();
  objectTableColumns: string[] = [
    "indicatorAcronym",
    "indicatorName",
    "standardWeight",
    "actions",
  ];

  constructor(
    public dialog: MatDialog,
    public deleteDialog: MatDialog,
    private _formBuilder: FormBuilder
  ) {}

  searchForm = this._formBuilder.group({
    filterValue: [""],
  });
  filterControl = this.searchForm.get("filterValue");

  ngOnInit(): void {
    this.loadContent("");
    if (this.filterControl) {
      this.filterControl.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((filterValue) => {
          this.loadContent(filterValue);
        });
    }
  }

  loadContent(filter: string | null) {
    if (this.component?.componentIndicators) {
      if (filter) {
        this.objectDataSource.data = this.component.componentIndicators.filter(
          (it) =>
            it.indicator?.indicatorName &&
            it.indicator?.indicatorName
              .toLocaleLowerCase()
              .includes(filter.toLocaleLowerCase())
        );
      } else {
        this.objectDataSource.data = this.component.componentIndicators ?? [];
      }
    }
  }

  newObject() {
    const dialogRef = this.dialog.open(ComponentsIndicatorsEditComponent, {
      width: "700px",
      data: {
        father: this.component,
        object: new ComponentIndicatorDTO(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        (this.component.componentIndicators ??= []).push(result);
        this.objectDataSource.data = [...this.component.componentIndicators];
      }
    });
  }

  editObject(object: ComponentIndicatorDTO) {
    const dialogRef = this.dialog.open(ComponentsIndicatorsEditComponent, {
      width: "700px",
      data: {
        father: this.component,
        object: object,
      },
    });

    dialogRef.afterClosed().subscribe((result: ComponentIndicatorDTO) => {
      if (result) {
        this.component.componentIndicators = (
          this.component.componentIndicators ?? []
        ).map((comInd) =>
          comInd.indicator.id === result.indicator.id ? result : comInd
        );

        this.objectDataSource.data = [...this.component.componentIndicators]; // nova referência
      }
    });
  }

  deleteObject(object: ComponentIndicatorDTO) {
    const dialogRef = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: "270px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Exclusão confirmada");
        console.log(this.component.componentIndicators?.length);
        this.component.componentIndicators = (
          this.component.componentIndicators ?? []
        ).filter((comInd) => comInd.id !== object.id);
        this.objectDataSource.data = this.component.componentIndicators;
        console.log(this.component.componentIndicators?.length);
      }
    });
  }
}
