import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaPipe } from './fecha.pipe';
import { BoolPipe } from './bool.pipe';



@NgModule({
  declarations: [
    FechaPipe,
    BoolPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FechaPipe,
    BoolPipe
  ]
})
export class PipesModule { }
