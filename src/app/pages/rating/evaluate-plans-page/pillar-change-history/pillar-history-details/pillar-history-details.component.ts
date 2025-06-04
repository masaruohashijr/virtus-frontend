import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pillar-history-details',
  templateUrl: './pillar-history-details.component.html',
})
export class PillarHistoryDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
