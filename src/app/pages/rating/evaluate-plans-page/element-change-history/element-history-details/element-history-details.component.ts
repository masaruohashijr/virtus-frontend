import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
@Component({
  selector: "app-element-history-details",
  templateUrl: "./element-history-details.component.html",
})
export class ElementHistoryDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}
