import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformesRoutingModule } from './informes-routing.module';
import { InformesComponent } from './informes.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ChartistModule } from 'ng-chartist';
import { GraficoTurnosDiaComponent } from './grafico-turnos-dia/grafico-turnos-dia.component';
import { GraficoTurnosEspecialidadComponent } from './grafico-turnos-especialidad/grafico-turnos-especialidad.component';
import { GraficoTurnosSolicitadoComponent } from './grafico-turnos-solicitado/grafico-turnos-solicitado.component';
import { GraficoTurnosFinalizadoComponent } from './grafico-turnos-finalizado/grafico-turnos-finalizado.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  declarations: [
    InformesComponent,
    GraficoTurnosDiaComponent,
    GraficoTurnosEspecialidadComponent,
    GraficoTurnosSolicitadoComponent,
    GraficoTurnosFinalizadoComponent
  ],
  imports: [
    CommonModule,
    InformesRoutingModule,
    PipesModule,
    ChartistModule,
    SharedModule,
    NgChartsModule,
    FormsModule,
    DirectivesModule
  ]
})
export class InformesModule { }
