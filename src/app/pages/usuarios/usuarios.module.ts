import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DetalleUsuariosComponent } from './detalle-usuarios/detalle-usuarios.component';


@NgModule({
  declarations: [
    UsuariosComponent,
    ListaUsuariosComponent,
    DetalleUsuariosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UsuariosRoutingModule,
    SharedModule,
    PipesModule,
    DirectivesModule
  ]
})
export class UsuariosModule { }
