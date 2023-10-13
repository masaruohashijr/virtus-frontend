import { Component, OnInit } from '@angular/core';
import { ACTIONS_ROUTE, CICLES_ROUTE, COMPONENTS_ROUTE, ELEMENTS_ROUTE, ENTITIES_ROUTE, FEATURES_ROUTE, OFFICES_ROUTE, PILLARS_ROUTE, ROLES_ROUTE, STATUS_ROUTE, TYPE_OF_NOTE_ROUTE, USERS_ROUTE, WORKFLOWS_ROUTE } from 'src/app/common/route-constants';

@Component({
  selector: 'app-nav-top',
  templateUrl: './nav-top.component.html',
  styleUrls: ['./nav-top.component.css']
})
export class NavTopComponent implements OnInit {

  constructor() { }

  entitiesRoute = ENTITIES_ROUTE;

  ciclesRoute = CICLES_ROUTE;
  pillarsRoute = PILLARS_ROUTE;
  componentsRoute = COMPONENTS_ROUTE;
  typeOfNoteRoute = TYPE_OF_NOTE_ROUTE;
  elementsRoute = ELEMENTS_ROUTE;

  usersRoute = USERS_ROUTE;
  officesRoute = OFFICES_ROUTE;
  rolesRoute = ROLES_ROUTE;
  featuresRoute = FEATURES_ROUTE;
  statusRoute = STATUS_ROUTE;
  actionsRoute = ACTIONS_ROUTE;
  workflowsRoute = WORKFLOWS_ROUTE;


  ngOnInit(): void {
  }

}
