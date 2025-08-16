import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { ConfirmationDialogComponent } from "src/app/components/dialog/confirmation-dialog/confirmation-dialog.component";
import { MemberDTO } from "src/app/domain/dto/member.dto";
import { OfficeDTO } from "src/app/domain/dto/office.dto";
import { OfficesService } from "src/app/services/administration/offices.service";
import { MembersEditComponent } from "../members-edit/members-edit.component";

@Component({
  selector: "app-members-list",
  templateUrl: "./members-list.component.html",
  styleUrls: ["./members-list.component.css"],
})
export class MembersListComponent implements OnInit {
  @Input() office!: OfficeDTO;

  objectDataSource: MatTableDataSource<MemberDTO> = new MatTableDataSource();
  objectTableColumns: string[] = [
    "name",
    "role",
    "startsAt",
    "endsAt",
    "actions",
  ];

  constructor(
    @Inject(MatDialog) public dialog: MatDialog,
    @Inject(MatDialog) public deleteDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _officeService: OfficesService
  ) {}

  searchForm = this._formBuilder.group({
    filterValue: [""],
  });
  filterControl = this.searchForm.get("filterValue");

  ngOnInit(): void {
    this.loadContent("");
    console.log(this.office);
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
    this._officeService
      .getMembersByOfficeId(filter, this.office.id, 0, 500)
      .subscribe((resp) => {
        this.office.members = resp.content.sort((a, b) =>
          (a.user?.name ?? "").localeCompare(b.user?.name ?? "")
        );
        this.objectDataSource.data = this.office.members;
      });
  }

  newObject() {
    const dialogRef = this.dialog.open(MembersEditComponent, {
      width: "700px",
      data: {
        father: this.office,
        object: new MemberDTO(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.office.members.push(result);
        this.objectDataSource.data = this.office.members;
      }
    });
  }

  editObject(object: MemberDTO) {
    const dialogRef = this.dialog.open(MembersEditComponent, {
      width: "700px",
      data: {
        father: this.office,
        object: object,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.office.jurisdictions.map((item) => {
        if (item.id == result.id) {
          item = result;
        }
      });
      this.objectDataSource.data = this.office.members;
    });
  }

  deleteObject(object: MemberDTO) {
    const dialogRef = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: "270px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.office.members = this.office.members?.filter(
          (item) => item.id !== object.id
        );
        this.objectDataSource.data = this.office.members;
      }
    });
  }
}
