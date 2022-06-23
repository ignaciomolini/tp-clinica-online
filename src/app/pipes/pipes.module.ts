import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaPipe } from './fecha.pipe';
import { BoolPipe } from './bool.pipe';
import { HistoriaClinicaPipe } from './historia-clinica.pipe';



@NgModule({
  declarations: [
    FechaPipe,
    BoolPipe,
    HistoriaClinicaPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FechaPipe,
    BoolPipe,
    HistoriaClinicaPipe
  ]
})
export class PipesModule { }
