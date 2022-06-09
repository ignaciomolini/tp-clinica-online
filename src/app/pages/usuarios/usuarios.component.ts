import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Administrador } from 'src/app/models/administrador';
import { Especialista } from 'src/app/models/especialista';
import { Paciente } from 'src/app/models/paciente';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  componente: string = 'lista usuarios';
  mostrarLoading: boolean = false;

  constructor(private usuarioService: UsuarioService, private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.usuarioService.traerTodosLosUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    })
  }

  async registrarUsuario(usuario: Paciente | Administrador | Especialista) {
    const { email, password } = usuario;
    try {
      this.mostrarLoading = true;
      usuario.uid = await (await this.authService.register(email, password)).user?.uid;
      usuario.activo = true;
      //await this.authService.sendVerificationEmail();
      await this.usuarioService.agregarUsuario(usuario);
      this.mostrarLoading = false;
      await Swal.fire({
        icon: 'success',
        title: 'Usuario registrado con exito!'
      })
    } catch (error: any) {
      this.mostrarLoading = false;
      this.toastr.error(error.message, "Error", {
        timeOut: 3000
      });
    }

  }
}