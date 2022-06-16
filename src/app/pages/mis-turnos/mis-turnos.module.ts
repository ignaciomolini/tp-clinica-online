import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisTurnosRoutingModule } from './mis-turnos-routing.module';
import { MisTurnosComponent } from './mis-turnos.component';
import { ListadoTurnosPacienteComponent } from './listado-turnos-paciente/listado-turnos-paciente.component';
import { ListadoTurnosEspecialistaComponent } from './listado-turnos-especialista/listado-turnos-especialista.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MisTurnosComponent,
    ListadoTurnosPacienteComponent,
    ListadoTurnosEspecialistaComponent
  ],
  imports: [
    CommonModule,
    MisTurnosRoutingModule,
    SharedModule,
    PipesModule,
    FormsModule
  ]
})
export class MisTurnosModule { }
