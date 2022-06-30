import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiPerfilRoutingModule } from './mi-perfil-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MiPerfilComponent } from './mi-perfil.component';
import { MisHorariosComponent } from './mis-horarios/mis-horarios.component';
import { DirectivesModule } from 'src/app/directives/directives.module';


@NgModule({
  declarations: [
    MiPerfilComponent,
    MisHorariosComponent
  ],
  imports: [
    CommonModule,
    MiPerfilRoutingModule,
    SharedModule, 
    PipesModule,
    DirectivesModule
  ]
})
export class MiPerfilModule { }
