import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, state } from '@angular/animations'
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('entrada', [
      state('void', style({
        transform: 'translateY(+5%)',
        opacity: 0
      })),
      transition(':enter', [
        animate("1s ease-in")
      ])
    ]),
  ]
})
export class HomeComponent implements OnInit {
  usuarioAuth: any;
  usuarioDB: any;
  cargar: boolean = false;

  constructor(private authService: AuthService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(usuario => {
      this.usuarioAuth = usuario;
    })
    this.usuarioService.traerTodosLosUsuarios().subscribe(usuarios => {
      usuarios.forEach(usuario => {
        if(this.usuarioAuth && this.usuarioAuth.email == usuario.email){
          this.usuarioDB = usuario;
        }
      })
    })
    setTimeout(() => {
      this.cargar = true;
    }, 200);
  }

  

}
