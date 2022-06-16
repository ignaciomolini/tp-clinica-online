import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { RolGuard } from './guards/rol.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule),
    data: {
      rol: 'administrador'
    },
    canActivate: [AuthGuard, RolGuard]
  },
  {
    path: 'solicitar-turno',
    loadChildren: () => import('./pages/solicitar-turno/solicitar-turno.module').then(m => m.SolicitarTurnoModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mis-turnos',
    loadChildren: () => import('./pages/mis-turnos/mis-turnos.module').then(m => m.MisTurnosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
