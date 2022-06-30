import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, state } from '@angular/animations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  usuarios: any[] = [];

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private authService: AuthService, private toastr: ToastrService, private rutas: Router, private logService: LogService) {
    this.formLogin = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  ngOnInit(): void {
    this.usuarioService.traerTodosLosUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    })
  }

  async ingresar() {
    const { email, password } = this.formLogin.getRawValue();
    try {
      let resp = await this.authService.login(email, password);
      if (!this.verificarUsuarioTesting(email) && !resp.user?.emailVerified) {
        await Swal.fire({
          icon: 'error',
          title: 'El email no esta verificado',
          text: 'Desea reenviar mail de verificacion?',
          showDenyButton: true,
          confirmButtonText: 'Reenviar',
          denyButtonText: 'Cerrar',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire('Se envio el mail de verificacion', 'Revise su casilla de mensajes', 'success')
          }
        })
        this.authService.logout();
      } else {
        this.usuarios.forEach(usuario => {
          if (usuario.uid == resp.user?.uid) {
            if (!usuario.activo) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La cuenta no esta activada por un admin!'
              })
              this.authService.logout();
            } else {
              //this.logService.agregarLog({usuario: usuario, fecha: new Date().getTime()})
              localStorage.setItem('usuario', JSON.stringify(usuario))
              this.rutas.navigateByUrl('');
            }
          }
        })
      }
    } catch (error: any) {
      this.toastr.error(error.message, "Error", {
        timeOut: 3000
      });
    }
  }

  verificarUsuarioTesting(email: string) {
    const emails = ['paciente1@testing.com', 'paciente2@testing.com', 'paciente3@testing.com',
      'especialista1@testing.com', 'especialista2@testing.com', 'admin@testing.com']
    if (emails.find(e => e == email)) {
      return true;
    }
    return false;
  }

  asignarUsuario(usuario: number) {
    switch (usuario) {
      case 1:
        this.formLogin.controls['email'].setValue('paciente1@testing.com');
        this.formLogin.controls['password'].setValue('123456');
        break;
      case 2:
        this.formLogin.controls['email'].setValue('paciente2@testing.com');
        this.formLogin.controls['password'].setValue('123456');
        break;
      case 3:
        this.formLogin.controls['email'].setValue('paciente3@testing.com');
        this.formLogin.controls['password'].setValue('123456');
        break;
      case 4:
        this.formLogin.controls['email'].setValue('especialista1@testing.com');
        this.formLogin.controls['password'].setValue('123456');
        break;
      case 5:
        this.formLogin.controls['email'].setValue('especialista2@testing.com');
        this.formLogin.controls['password'].setValue('123456');
        break;
      case 6:
        this.formLogin.controls['email'].setValue('admin@testing.com');
        this.formLogin.controls['password'].setValue('123456');
        break;
    }
  }


}
