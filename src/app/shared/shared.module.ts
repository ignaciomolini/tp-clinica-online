import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { LoadingComponent } from './loading/loading.component';
import { RouterModule } from '@angular/router';
import { FormPacienteComponent } from './form-paciente/form-paciente.component';
import { FormEspecialistaComponent } from './form-especialista/form-especialista.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormAdministradorComponent } from './form-administrador/form-administrador.component';
import { HistoriaClinicaComponent } from './historia-clinica/historia-clinica.component';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
  declarations: [
    NavbarComponent,
    LoadingComponent,
    FormPacienteComponent,
    FormEspecialistaComponent,
    FormAdministradorComponent,
    HistoriaClinicaComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PipesModule,
    DirectivesModule
  ],
  exports: [
    NavbarComponent,
    LoadingComponent,
    FormPacienteComponent,
    FormEspecialistaComponent,
    FormAdministradorComponent,
    HistoriaClinicaComponent
  ]
})
export class SharedModule { }
