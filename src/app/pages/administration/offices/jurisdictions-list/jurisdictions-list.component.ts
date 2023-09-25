import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { JurisdictionDTO } from 'src/app/domain/dto/jurisdiction.dto';
import { OfficeDTO } from 'src/app/domain/dto/office.dto';
import { OfficesService } from 'src/app/services/administration/offices.service';
import { JurisdictionsEditComponent } from '../jurisdictions-edit/jurisdictions-edit.component';
import { ConfirmationDialogComponent } from 'src/app/components/dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-jurisdictions-list',
  templateUrl: './jurisdictions-list.component.html',
  styleUrls: ['./jurisdictions-list.component.css']
})
export class JurisdictionsListComponent implements OnInit {

  @Input() office!: OfficeDTO;

  objectDataSource: MatTableDataSource<JurisdictionDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['acronym', 'name', 'startsAt', 'endsAt', "actions"];

  constructor(
    public dialog: MatDialog,
    public deleteDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _officeService: OfficesService) { }

  searchForm = this._formBuilder.group({
    filterValue: ['']
  })
  filterControl = this.searchForm.get('filterValue');

  ngOnInit(): void {
    this.loadContent('');
    console.log(this.office)
    if (this.filterControl) {
      this.filterControl.valueChanges.pipe(
        debounceTime(300), // Atraso de 300 ms após a última alteração
        distinctUntilChanged() // Filtra apenas valores distintos consecutivos
      ).subscribe(filterValue => {
        this.loadContent(filterValue);
      });
    }
  }

  loadContent(filter: string | null) {
    this._officeService.getJurisdictionsByOfficeId(filter, this.office.id, 0, 500).subscribe(resp => {
      this.office.jurisdictions = resp.content;
      this.objectDataSource.data  = this.office.jurisdictions;
    })
  }

  newObject() {
    const dialogRef = this.dialog.open(JurisdictionsEditComponent, {
      width: '700px',
      data: {
        father: this.office,
        object: new JurisdictionDTO()
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.office.jurisdictions.push(result)
        this.objectDataSource.data = this.office.jurisdictions;
      }
    });
  }

  editObject(object: JurisdictionDTO) {
    const dialogRef = this.dialog.open(JurisdictionsEditComponent, {
      width: '700px',
      data: {
        father: this.office,
        object: object
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.office.jurisdictions.map(item => {
        if (item.id == result.id) {
          item = result;
        }
      })
      this.objectDataSource.data = this.office.jurisdictions;
    });
  }

  deleteObject(object: JurisdictionDTO) {
    const dialogRef = this.deleteDialog.open(ConfirmationDialogComponent, {
      width: '270px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.office.jurisdictions = this.office.jurisdictions?.filter(item => item.id !== object.id);
        this.objectDataSource.data = this.office.jurisdictions;
      }
    });
  }

}
