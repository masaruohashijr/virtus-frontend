import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmationDialogComponent } from './components/dialog/confirmation-dialog/confirmation-dialog.component';
import { NavTopComponent } from './components/nav-top/nav-top.component';
import { ActionsEditComponent } from './pages/administration/actions/actions-edit/actions-edit.component';
import { ActionsComponent } from './pages/administration/actions/actions.component';
import { FeaturesEditComponent } from './pages/administration/features/features-edit/features-edit.component';
import { FeaturesComponent } from './pages/administration/features/features.component';
import { OfficesComponent } from './pages/administration/offices/offices.component';
import { RolesComponent } from './pages/administration/roles/roles.component';
import { StatusEditComponent } from './pages/administration/status/status-edit/status-edit.component';
import { StatusPageComponent } from './pages/administration/status/status.component';
import { UsersComponent } from './pages/administration/users/users.component';
import { ActivitiesEditComponent } from './pages/administration/workflows/workflows-edit/activities-edit/activities-edit.component';
import { ActivitiesListComponent } from './pages/administration/workflows/workflows-edit/activities-list/activities-list.component';
import { WorkflowsEditComponent } from './pages/administration/workflows/workflows-edit/workflows-edit.component';
import { WorkflowsComponent } from './pages/administration/workflows/workflows.component';
import { BaseCrudPageComponent } from './pages/common/base-crud-page/base-crud-page.component';
import { ComponentsEditComponent } from './pages/configuration/components-page/components-edit/components-edit.component';
import { ComponentsElementsEditComponent } from './pages/configuration/components-page/components-edit/components-elements-edit/components-elements-edit.component';
import { ComponentsElementsListComponent } from './pages/configuration/components-page/components-edit/components-elements-list/components-elements-list.component';
import { ComponentsGradeEditComponent } from './pages/configuration/components-page/components-edit/components-grade-edit/components-grade-edit.component';
import { ComponentsGradeListComponent } from './pages/configuration/components-page/components-edit/components-grade-list/components-grade-list.component';
import { ComponentsPageComponent } from './pages/configuration/components-page/components-page.component';
import { CyclesEditComponent } from './pages/configuration/cycles-page/cycles-edit/cycles-edit.component';
import { CyclesPillarsEditComponent } from './pages/configuration/cycles-page/cycles-edit/cycles-pillars-edit/cycles-pillars-edit.component';
import { CyclesPillarsListComponent } from './pages/configuration/cycles-page/cycles-edit/cycles-pillars-list/cycles-pillars-list.component';
import { CyclesPageComponent } from './pages/configuration/cycles-page/cycles-page.component';
import { ElementsEditComponent } from './pages/configuration/elements-page/elements-edit/elements-edit.component';
import { ElementsItemEditComponent } from './pages/configuration/elements-page/elements-edit/elements-item-edit/elements-item-edit.component';
import { ElementsItemListComponent } from './pages/configuration/elements-page/elements-edit/elements-item-list/elements-item-list.component';
import { ElementsPageComponent } from './pages/configuration/elements-page/elements-page.component';
import { GradeTypeEditComponent } from './pages/configuration/grade-type/grade-type-edit/grade-type-edit.component';
import { GradeTypePageComponent } from './pages/configuration/grade-type/grade-type-page.component';
import { PillarsComponentEditComponent } from './pages/configuration/pillars-page/pillars-edit/pillars-component-edit/pillars-component-edit.component';
import { PillarsComponentListComponent } from './pages/configuration/pillars-page/pillars-edit/pillars-component-list/pillars-component-list.component';
import { PillarsEditComponent } from './pages/configuration/pillars-page/pillars-edit/pillars-edit.component';
import { PillarsPageComponent } from './pages/configuration/pillars-page/pillars-page.component';
import { MainLayoutPageComponent } from './pages/main-layout-page/main-layout-page.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { RolesEditComponent } from './pages/administration/roles/roles-edit/roles-edit.component';
import { UserEditComponent } from './pages/administration/users/user-edit/user-edit.component';
import { OfficesEditComponent } from './pages/administration/offices/offices-edit/offices-edit.component';
import { UserUpdatePassEditComponent } from './pages/administration/users/user-update-pass-edit/user-update-pass-edit.component';
import { OfficesJurisdictionsEditComponent } from './pages/administration/offices/offices-jurisdictions-edit/offices-jurisdictions-edit.component';
import { OfficesMembersEditComponent } from './pages/administration/offices/offices-members-edit/offices-members-edit.component';
import { JurisdictionsEditComponent } from './pages/administration/offices/jurisdictions-edit/jurisdictions-edit.component';
import { MembersEditComponent } from './pages/administration/offices/members-edit/members-edit.component';
import { MembersListComponent } from './pages/administration/offices/members-list/members-list.component';
import { JurisdictionsListComponent } from './pages/administration/offices/jurisdictions-list/jurisdictions-list.component';
import { EntitiesPageComponent } from './pages/rating/entities-page/entities-page.component';
import { EntitiesEditComponent } from './pages/rating/entities-page/entities-edit/entities-edit.component';
import { CyclesEntitiesListComponent } from './pages/rating/entities-page/entities-edit/cycles-entities-list/cycles-entities-list.component';
import { CyclesEntitiesEditComponent } from './pages/rating/entities-page/entities-edit/cycles-entities-edit/cycles-entities-edit.component';
import { PlansListComponent } from './pages/rating/entities-page/entities-edit/plans-list/plans-list.component';
import { PlansEditComponent } from './pages/rating/entities-page/entities-edit/plans-edit/plans-edit.component';
import { StartCyclesEditComponent } from './pages/configuration/cycles-page/start-cycles-edit/start-cycles-edit.component';
import { AssingTeamsPageComponent } from './pages/coordination/assing-teams-page/assing-teams-page.component';
import { AssingTeamsEditComponent } from './pages/coordination/assing-teams-page/assing-teams-edit/assing-teams-edit.component';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { TeamMembersListComponent } from './pages/coordination/assing-teams-page/assing-teams-edit/team-members-list/team-members-list.component';
import { TeamMembersEditComponent } from './pages/coordination/assing-teams-page/assing-teams-edit/team-members-edit/team-members-edit.component';
import { AlertDialogComponent } from './components/dialog/alert-dialog/alert-dialog.component';
import { DistributeActivitiesComponent } from './pages/coordination/distribute-activities/distribute-activities.component';
import { DistributeActivitiesEditComponent } from './pages/coordination/distribute-activities/distribute-activities-edit/distribute-activities-edit.component';
import { MatTreeModule } from '@angular/material/tree';

@NgModule({
  declarations: [
    AppComponent,
    NavTopComponent,
    GradeTypePageComponent,
    MainLayoutPageComponent,
    PillarsPageComponent,
    ComponentsPageComponent,
    ElementsPageComponent,
    GradeTypeEditComponent,
    BaseCrudPageComponent,
    ConfirmationDialogComponent,
    ElementsEditComponent,
    ElementsItemListComponent,
    ElementsItemEditComponent,
    ComponentsEditComponent,
    ComponentsGradeListComponent,
    ComponentsGradeEditComponent,
    ComponentsElementsListComponent,
    ComponentsElementsEditComponent,
    PillarsEditComponent,
    PillarsComponentListComponent,
    PillarsComponentEditComponent,
    CyclesEditComponent,
    CyclesPillarsListComponent,
    CyclesPillarsEditComponent,
    CyclesPageComponent,
    FeaturesComponent,
    UsersComponent,
    OfficesComponent,
    RolesComponent,
    StatusPageComponent,
    ActionsComponent,
    WorkflowsComponent,
    StatusEditComponent,
    FeaturesEditComponent,
    ActionsEditComponent,
    WorkflowsEditComponent,
    ActivitiesListComponent,
    ActivitiesEditComponent,
    RolesEditComponent,
    UserEditComponent,
    OfficesEditComponent,
    UserUpdatePassEditComponent,
    OfficesJurisdictionsEditComponent,
    OfficesMembersEditComponent,
    JurisdictionsEditComponent,
    MembersEditComponent,
    MembersListComponent,
    JurisdictionsListComponent,
    EntitiesPageComponent,
    EntitiesEditComponent,
    CyclesEntitiesListComponent,
    CyclesEntitiesEditComponent,
    PlansListComponent,
    PlansEditComponent,
    StartCyclesEditComponent,
    AssingTeamsPageComponent,
    AssingTeamsEditComponent,
    LoginComponent,
    TeamMembersListComponent,
    TeamMembersEditComponent,
    AlertDialogComponent,
    DistributeActivitiesComponent,
    DistributeActivitiesEditComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatDividerModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatCardModule,
    MatTreeModule
  ],
  providers: [
    MatDialogActions,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
