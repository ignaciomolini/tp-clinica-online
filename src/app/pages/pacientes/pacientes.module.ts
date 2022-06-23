import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PacientesRoutingModule } from './pacientes-routing.module';
import { PacientesComponent } from './pacientes.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetallePacienteComponent } from './detalle-paciente/detalle-paciente.component';


@NgModule({
  declarations: [
    PacientesComponent,
    DetallePacienteComponent
  ],
  imports: [
    CommonModule,
    PacientesRoutingModule,
    PipesModule,
    SharedModule
  ]
})
export class PacientesModule { }
