import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
  ACTIONS_ROUTE,
  ASSING_TEAMS_ROUTE,
  CICLES_ROUTE,
  COMPONENTS_ROUTE,
  DISTRIBUTE_ACTIVITIES_ROUTE,
  ELEMENTS_ROUTE,
  ENTITIES_ROUTE,
  EVALUATE_PLANS_ROUTE,
  FEATURES_ROUTE,
  OFFICES_ROUTE,
  PILLARS_ROUTE,
  ROLES_ROUTE,
  STATUS_ROUTE,
  TYPE_OF_NOTE_ROUTE,
  USERS_ROUTE,
  WORKFLOWS_ROUTE,
  INDICATORS_ROUTE,
  INDICATOR_SCORES_ROUTE,
  AUTOMATIC_SCORES_ROUTE
} from 'src/app/common/route-constants';

import { CurrentUser } from 'src/app/domain/dto/current-user.dto';
import { UserUpdatePassEditComponent } from 'src/app/pages/administration/users/user-update-pass-edit/user-update-pass-edit.component';
import { UsersService } from 'src/app/services/administration/users.service';

@Component({
  selector: 'app-nav-top',
  templateUrl: './nav-top.component.html',
  styleUrls: ['./nav-top.component.css']
})
export class NavTopComponent implements OnInit {

  loggedUser!: CurrentUser;

  constructor(
    private _userService: UsersService,
    public dialog: MatDialog
  ) {}

  entitiesRoute = ENTITIES_ROUTE;
  evaluatePlans = EVALUATE_PLANS_ROUTE;

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

  assingTeams = ASSING_TEAMS_ROUTE;
  distributeActivities = DISTRIBUTE_ACTIVITIES_ROUTE;

  // ✅ Novas rotas adicionadas
  indicatorsRoute = INDICATORS_ROUTE;
  indicatorScoresRoute = INDICATOR_SCORES_ROUTE;
  automaticScoresRoute = AUTOMATIC_SCORES_ROUTE;

  ngOnInit(): void {
    this.loggedUser = this._userService.getCurrentUser();
  }

  loggout() {
    window.location.reload();
  }

  changePassword() {
    this._userService.getById(this.loggedUser.id).subscribe(resp => {
      const object = resp;

      this.dialog.open(UserUpdatePassEditComponent, {
        width: '600px',
        data: object,
      });
    });
  }
}
