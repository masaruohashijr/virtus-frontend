import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-plan-history-details',
  templateUrl: './plan-history-details.component.html',
})
export class PlanHistoryDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
