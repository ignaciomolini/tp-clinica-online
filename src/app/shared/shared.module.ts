import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { LoadingComponent } from './loading/loading.component';
import { RouterModule } from '@angular/router';
import { FormPacienteComponent } from './form-paciente/form-paciente.component';
import { FormEspecialistaComponent } from './form-especialista/form-especialista.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormAdministradorComponent } from './form-administrador/form-administrador.component';



@NgModule({
  declarations: [
    NavbarComponent,
    LoadingComponent,
    FormPacienteComponent,
    FormEspecialistaComponent,
    FormAdministradorComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    NavbarComponent,
    LoadingComponent,
    FormPacienteComponent,
    FormEspecialistaComponent,
    FormAdministradorComponent
  ]
})
export class SharedModule { }
