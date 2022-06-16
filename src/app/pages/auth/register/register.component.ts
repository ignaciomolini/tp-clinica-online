import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, state } from '@angular/animations';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Especialista } from 'src/app/models/especialista';
import { Paciente } from 'src/app/models/paciente';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
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
export class RegisterComponent implements OnInit {
  formElegido: string = '';
  mostrarLoading: boolean = false;
  captcha: string = '';

  constructor(private authService: AuthService, private rutas: Router, private toastr: ToastrService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
  }

  resolved(captchaResponse: string){
    this.captcha = captchaResponse;
  }

  async registrarUsuario(usuario: Paciente | Especialista) {
    const { email, password } = usuario;
    try {
      this.mostrarLoading = true;
      usuario.uid = await(await this.authService.register(email, password)).user?.uid || '';
      await this.usuarioService.agregarUsuario(usuario);
      this.mostrarLoading = false;
      await Swal.fire({
        icon: 'success',
        title: 'Registrado con exito!',
        text: 'Verifique su cuenta por medio del correo que se le envio'
      })
      this.rutas.navigate(['auth/login']);
    } catch (error: any) {
      this.mostrarLoading = false;
      this.toastr.error(error.message, "Error", {
        timeOut: 3000
      });
    } 
  }

}
