import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductComponentDTO } from 'src/app/domain/dto/product-component.dto';
import { DistributeActivitiesService } from 'src/app/services/coordination/distribute-activities.service';

@Component({
  selector: 'app-history-view',
  templateUrl: './history-view.component.html',
  styleUrls: ['./history-view.component.css']
})
export class HistoryViewComponent implements OnInit {

  historyForm!: FormGroup;

  constructor(
    private errorDialog: MatDialog,
    private formBuilder: FormBuilder,
    private _service: DistributeActivitiesService,
    public dialogRef: MatDialogRef<ProductComponentDTO>,
    @Inject(MAT_DIALOG_DATA) public data: ProductComponentDTO
  ) { }

  ngOnInit(): void {
    this.historyForm = this.formBuilder.group({
      efpc: [''],
      cycle: [''],
      pillar: [''],
      component: [''],
      motivos: [[]]
    });
  }


  getTitle() {
    return "Histórico do Componente"
  }

}
