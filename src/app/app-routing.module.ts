import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ACTIONS_ROUTE, ASSING_TEAMS_ROUTE, CICLES_ROUTE, COMPONENTS_ROUTE, DISTRIBUTE_ACTIVITIES_ROUTE, ELEMENTS_ROUTE, ENTITIES_ROUTE, EVALUATE_PLANS_ROUTE, FEATURES_ROUTE, LOGIN, OFFICES_ROUTE, PILLARS_ROUTE, ROLES_ROUTE, STATUS_ROUTE, TYPE_OF_NOTE_ROUTE, USERS_ROUTE, WORKFLOWS_ROUTE } from './common/route-constants';
import { MainLayoutPageComponent } from './pages/main-layout-page/main-layout-page.component';
import { ComponentsPageComponent } from './pages/configuration/components-page/components-page.component';
import { ElementsPageComponent } from './pages/configuration/elements-page/elements-page.component';
import { PillarsPageComponent } from './pages/configuration/pillars-page/pillars-page.component';
import { GradeTypePageComponent } from './pages/configuration/grade-type/grade-type-page.component';
import { CyclesPageComponent } from './pages/configuration/cycles-page/cycles-page.component';
import { UsersComponent } from './pages/administration/users/users.component';
import { OfficesComponent } from './pages/administration/offices/offices.component';
import { RolesComponent } from './pages/administration/roles/roles.component';
import { FeaturesComponent } from './pages/administration/features/features.component';
import { StatusPageComponent } from './pages/administration/status/status.component';
import { ActionsComponent } from './pages/administration/actions/actions.component';
import { WorkflowsComponent } from './pages/administration/workflows/workflows.component';
import { EntitiesPageComponent } from './pages/rating/entities-page/entities-page.component';
import { AssingTeamsPageComponent } from './pages/coordination/assing-teams-page/assing-teams-page.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { DistributeActivitiesComponent } from './pages/coordination/distribute-activities/distribute-activities.component';
import { EvaluatePlansPageComponent } from './pages/rating/evaluate-plans-page/evaluate-plans-page.component';

const routes: Routes = [
  { path: LOGIN, component: LoginComponent },
  {
    path: '', component: MainLayoutPageComponent,
    canMatch: [AuthGuard],
    children: [
      { path: CICLES_ROUTE, component: CyclesPageComponent },
      { path: ENTITIES_ROUTE, component: EntitiesPageComponent },
      { path: PILLARS_ROUTE, component: PillarsPageComponent },
      { path: COMPONENTS_ROUTE, component: ComponentsPageComponent },
      { path: TYPE_OF_NOTE_ROUTE, component: GradeTypePageComponent },
      { path: ELEMENTS_ROUTE, component: ElementsPageComponent },
      { path: USERS_ROUTE, component: UsersComponent },
      { path: OFFICES_ROUTE, component: OfficesComponent },
      { path: ROLES_ROUTE, component: RolesComponent },
      { path: FEATURES_ROUTE, component: FeaturesComponent },
      { path: STATUS_ROUTE, component: StatusPageComponent },
      { path: ACTIONS_ROUTE, component: ActionsComponent },
      { path: WORKFLOWS_ROUTE, component: WorkflowsComponent },
      { path: ASSING_TEAMS_ROUTE, component: AssingTeamsPageComponent },
      { path: DISTRIBUTE_ACTIVITIES_ROUTE, component: DistributeActivitiesComponent },
      { path: EVALUATE_PLANS_ROUTE, component: EvaluatePlansPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
