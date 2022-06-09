import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  usuarioAuth: any;
  usuarioDB: any;
  fotoPerfil: string = '';

  constructor(private authService: AuthService, private usuarioService: UsuarioService, private rutas: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(usuario => {
      this.usuarioAuth = usuario;
    })
    this.usuarioService.traerTodosLosUsuarios().subscribe(usuarios => {
      usuarios.forEach(usuario => {
        if(this.usuarioAuth && this.usuarioAuth.email == usuario.email){
          this.usuarioDB = usuario;
          this.fotoPerfil = usuario.foto1 || usuario.foto;
        }
      })
    })
  }

  async cerrarSesion(){
    try {
      await this.authService.logout();
      this.usuarioDB = undefined;
      this.fotoPerfil = '';
      localStorage.removeItem('usuario');
      this.rutas.navigate(['auth/login']);
      this.toastr.success("Sesion cerrada correctamente", "Hasta luego", {
        timeOut: 3000
      });
    } catch (error: any) {
      this.toastr.error(error.message, "Error", {
        timeOut: 3000
      });
    }    
  }

}
