import { Component, OnInit } from '@angular/core';
import { CICLES_ROUTE, COMPONENTS_ROUTE, ELEMENTS_ROUTE, PILLARS_ROUTE, TYPE_OF_NOTE_ROUTE } from 'src/app/common/route-constants';

@Component({
  selector: 'app-nav-top',
  templateUrl: './nav-top.component.html',
  styleUrls: ['./nav-top.component.css']
})
export class NavTopComponent implements OnInit {

  constructor() { }

  ciclesRoute = CICLES_ROUTE;
  pillarsRoute = PILLARS_ROUTE;
  componentsRoute = COMPONENTS_ROUTE;
  typeOfNoteRoute = TYPE_OF_NOTE_ROUTE;
  elementsRoute = ELEMENTS_ROUTE;


  ngOnInit(): void {
  }

}
