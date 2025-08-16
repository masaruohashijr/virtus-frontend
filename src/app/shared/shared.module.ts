// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// importe componentes/pipes DIRETAMENTE, sem barrel
// import { SomePipe } from './pipes/some.pipe';
// import { SomeComponent } from './components/some.component';

@NgModule({
  declarations: [
    // SomePipe, SomeComponent
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    // SomePipe, SomeComponent
  ],
})
export class SharedModule {}
