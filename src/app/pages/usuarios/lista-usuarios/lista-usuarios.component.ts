import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Especialista } from 'src/app/models/especialista';
import { Paciente } from 'src/app/models/paciente';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {
  @Input() listaUsuarios: any[] = [];
  subs: Subscription;
  listaFiltrada: any[] = [];
  rolSeleccionado: string = 'Todos';
  estadoSeleccionado: any = 'Todos';

  constructor(private usuariosService: UsuarioService) {
    this.subs = this.usuariosService.traerTodosLosUsuarios().subscribe(usuarios => {
      this.listaFiltrada = usuarios;
    })
  }

  ngOnInit(): void {
  }

  cambiarEstado(usuario: Paciente | Especialista) {
    let estado = usuario.activo ? false : true;
    let id = usuario.idDb || '';
    this.usuariosService.modificarEstadoActivo(id, estado).then(() => {
      this.filtrarLista();
    });
  }

  filtrarLista() {
    let estado = (this.estadoSeleccionado == 'true') ? true : false;

    if (this.rolSeleccionado == 'Todos' && this.estadoSeleccionado == 'Todos') {
      this.listaFiltrada = this.listaUsuarios;

    } else if (this.rolSeleccionado != 'Todos' && this.estadoSeleccionado == 'Todos') {
      this.listaFiltrada = this.listaUsuarios.filter(usuario => usuario.rol == this.rolSeleccionado);

    } else if (this.rolSeleccionado == 'Todos' && this.estadoSeleccionado != 'Todos') {
      this.listaFiltrada = this.listaUsuarios.filter(usuario => usuario.activo == estado);
      
    } else {
      this.listaFiltrada = this.listaUsuarios.filter(usuario => (usuario.activo == estado) &&
        (usuario.rol == this.rolSeleccionado));
    }
    this.subs.unsubscribe();
  }

}
