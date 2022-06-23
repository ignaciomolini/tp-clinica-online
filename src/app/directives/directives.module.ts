import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocoDirective } from './foco.directive';
import { BgTurnosDirective } from './bg-turnos.directive';
import { LupaDirective } from './lupa.directive';

@NgModule({
  declarations: [
    FocoDirective,
    BgTurnosDirective,
    LupaDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FocoDirective,
    BgTurnosDirective,
    LupaDirective
  ]
})
export class DirectivesModule { }
