import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, state } from '@angular/animations';
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
  styleUrls: ['./usuarios.component.css'],
  animations: [
    trigger('entrada', [
      state('void', style({
        transform: 'translateX(+10%)',
        opacity: 0
      })),
      transition(':enter', [
        animate("1s cubic-bezier(.17,.67,.88,.1)")
      ])
    ])
  ]
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
    let admin = {email: '', password: ''};
    this.authService.getCurrentUserPromise().then(usuario => {
      this.usuarios.forEach(usuarioDB => {
        if(usuarioDB.email == usuario?.email){
          admin = usuarioDB;
        }
      });
    })
    try {
      this.mostrarLoading = true;
      usuario.uid = await (await this.authService.register(email, password)).user?.uid;
      await this.authService.login(admin.email, admin.password);
      usuario.activo = true;
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