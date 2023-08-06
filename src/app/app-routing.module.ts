import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CICLES_ROUTE, COMPONENTS_ROUTE, ELEMENTS_ROUTE, PILLARS_ROUTE, TYPE_OF_NOTE_ROUTE } from './common/route-constants';
import { MainLayoutPageComponent } from './pages/main-layout-page/main-layout-page.component';
import { ComponentsPageComponent } from './pages/configuration/components-page/components-page.component';
import { ElementsPageComponent } from './pages/configuration/elements-page/elements-page.component';
import { PillarsPageComponent } from './pages/configuration/pillars-page/pillars-page.component';
import { GradeTypePageComponent } from './pages/configuration/grade-type/grade-type-page.component';
import { CyclesPageComponent } from './pages/configuration/cycles-page/cycles-page.component';

const routes: Routes = [
  {
    path: '', component: MainLayoutPageComponent,
    children: [
      { path: CICLES_ROUTE, component: CyclesPageComponent },
      { path: PILLARS_ROUTE, component: PillarsPageComponent },
      { path: COMPONENTS_ROUTE, component: ComponentsPageComponent },
      { path: TYPE_OF_NOTE_ROUTE, component: GradeTypePageComponent },
      { path: ELEMENTS_ROUTE, component: ElementsPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
