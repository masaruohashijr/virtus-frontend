import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HistoryComponentDTO } from 'src/app/domain/dto/history-component';
import { History } from 'src/app/domain/dto/history.dto';
import { ProductComponentDTO } from 'src/app/domain/dto/product-component.dto';
import { DistributeActivitiesService } from 'src/app/services/coordination/distribute-activities.service';
import { HistoryService } from 'src/app/services/coordination/history.service';

@Component({
  selector: 'app-history-view',
  templateUrl: './history-view.component.html',
  styleUrls: ['./history-view.component.css']
})
export class HistoryViewComponent implements OnInit {

  historyForm!: FormGroup;
  history!: HistoryComponentDTO[];

  constructor(
    private errorDialog: MatDialog,
    private formBuilder: FormBuilder,
    private _service: HistoryService,
    public dialogRef: MatDialogRef<ProductComponentDTO>,
    private cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: History
  ) { }

  ngOnInit(): void {
    this.historyForm = this.formBuilder.group({
      efpc: [{ value: this.data.productComponent.entity.name, disabled: true }],
      cycle: [{ value: this.data.productComponent.cycle.cycle?.name, disabled: true }],
      pillar: [{ value: this.data.productComponent.pillar.name, disabled: true }],
      component: [{ value: this.data.productComponent.component.name, disabled: true }],
      motivos: [{ value: [], disabled: true }]
    });
  }


  getTitle() {
    return "Histórico do Componente"
  }

}
