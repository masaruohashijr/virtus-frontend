import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-component-history-details',
  templateUrl: './component-history-details.component.html',
})
export class ComponentHistoryDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
