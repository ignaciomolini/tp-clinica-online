import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocoDirective } from './foco.directive';
import { BgTurnosDirective } from './bg-turnos.directive';
import { LupaDirective } from './lupa.directive';
import { CaptchaDirective } from './captcha.directive';

@NgModule({
  declarations: [
    FocoDirective,
    BgTurnosDirective,
    LupaDirective,
    CaptchaDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FocoDirective,
    BgTurnosDirective,
    LupaDirective,
    CaptchaDirective
  ]
})
export class DirectivesModule { }
