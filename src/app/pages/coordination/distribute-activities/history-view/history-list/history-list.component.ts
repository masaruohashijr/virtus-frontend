import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { HistoryViewReasonComponent } from '../history-view-reason/history-view-reason.component';
import { HistoryComponentDTO } from 'src/app/domain/dto/history-component';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnInit {

  @Input() history: HistoryComponentDTO[] = [];

  objectDataSource: MatTableDataSource<HistoryComponentDTO> = new MatTableDataSource();
  objectTableColumns: string[] = ['name', 'averageType', 'standardWeight', 'author', 'createdAt', "actions"];

  constructor(
    public dialog: MatDialog,
    public deleteDialog: MatDialog,
    private _formBuilder: FormBuilder) { }

  searchForm = this._formBuilder.group({
    filterValue: ['']
  })
  filterControl = this.searchForm.get('filterValue');

  ngOnInit(): void {
    this.loadContent('');
    console.log(this.history)
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
    if (filter) {
      this.objectDataSource.data = this.history?.filter(it => it.authorName.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
    } else {
      this.objectDataSource.data = this.history;
    }
  }

  viewObject(object: HistoryComponentDTO) {
    const dialogRef = this.dialog.open(HistoryViewReasonComponent, {
      width: '700px',
      data: {
        father: this.history,
        object: object
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.history.map(item => {
        if (item.id == result.id) {
          item = result;
        }
      })
      this.objectDataSource.data = this.history;
    });
  }

}
