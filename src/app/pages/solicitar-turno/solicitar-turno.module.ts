import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitarTurnoRoutingModule } from './solicitar-turno-routing.module';
import { SolicitarTurnoComponent } from './solicitar-turno.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DirectivesModule } from 'src/app/directives/directives.module';


@NgModule({
  declarations: [
    SolicitarTurnoComponent
  ],
  imports: [
    CommonModule,
    SolicitarTurnoRoutingModule,
    SharedModule,
    DirectivesModule
  ]
})
export class SolicitarTurnoModule { }
