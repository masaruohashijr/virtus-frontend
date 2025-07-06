import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { ComponentGradeType as ComponentGradeTypeDTO } from "src/app/domain/dto/component-grade-type.dto";
import { ComponentDTO } from "src/app/domain/dto/components.dto";
import { ComponentsGradeEditComponent } from "../components-grade-edit/components-grade-edit.component";
import { ConfirmationDialogComponent } from "src/app/components/dialog/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "app-components-grade-list",
  templateUrl: "./components-grade-list.component.html",
  styleUrls: ["./components-grade-list.component.css"],
})
export class ComponentsGradeListComponent implements OnInit {
  @Input() component!: ComponentDTO;
  objectDataSource: MatTableDataSource<ComponentGradeTypeDTO> =
    new MatTableDataSource();
  objectTableColumns: string[] = ["gradeType", "standardWeight", "actions"];

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
    console.log(this.component);
    if (this.filterControl) {
      this.filterControl.valueChanges
        .pipe(
          debounceTime(300), // Atraso de 300 ms após a última alteração
          distinctUntilChanged() // Filtra apenas valores distintos consecutivos
        )
        .subscribe((filterValue) => {
          this.loadContent(filterValue);
        });
    }
  }

  loadContent(filter: string | null) {
    if (this.component?.componentGradeTypes) {
      if (filter) {
        this.objectDataSource.data = this.component?.componentGradeTypes.filter(
          (it) =>
            it.gradeType?.name &&
            it.gradeType?.name
              .toLocaleLowerCase()
              .includes(filter.toLocaleLowerCase())
        );
      } else {
        this.objectDataSource.data = this.component?.componentGradeTypes;
      }
    }
  }

  newObject() {
    const dialogRef = this.dialog.open(ComponentsGradeEditComponent, {
      width: "700px",
      data: {
        father: this.component,
        object: new ComponentGradeTypeDTO(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.component?.componentGradeTypes.push(result);
        this.objectDataSource.data = this.component?.componentGradeTypes;
      }
    });
  }

  editObject(object: ComponentGradeTypeDTO) {
    const dialogRef = this.dialog.open(ComponentsGradeEditComponent, {
      width: "700px",
      data: {
        father: this.component,
        object: object,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.component?.componentGradeTypes.map((item) => {
        if (item.id == result.id) {
          item = result;
        }
      });
      this.objectDataSource.data = this.component?.componentGradeTypes;
    });
  }

  deleteObject(object: ComponentGradeTypeDTO) {
    const dialogRef = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: "270px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.component.componentGradeTypes =
          this.component?.componentGradeTypes?.filter(
            (item) => item.id !== object.id
          );
        this.objectDataSource.data = this.component?.componentGradeTypes;
      }
    });
  }
}
