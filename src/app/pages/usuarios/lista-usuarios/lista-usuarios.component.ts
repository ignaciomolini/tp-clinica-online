import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Especialista } from 'src/app/models/especialista';
import { Paciente } from 'src/app/models/paciente';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as XLSX from 'xlsx';

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
  estadoSeleccionado: string = 'Todos';
  usuarioSeleccionado: any;
  excel: boolean = false;
  estado: string = 'tabla';

  constructor(private usuariosService: UsuarioService) {
    this.subs = this.usuariosService.traerTodosLosUsuarios().subscribe(usuarios => {
      this.listaFiltrada = usuarios;
    })
  }

  ngOnInit(): void {
  }

  mostrarHistoriaClinica(usuario: Paciente){
    this.usuarioSeleccionado = usuario;
    this.estado = 'historia clinica';
  }

  mostrarDetalle(usuario: any){
    this.usuarioSeleccionado = usuario;
    this.estado = 'detalle';
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

  exportarAExcel() {
    this.excel = true;
    setTimeout(() => {
      let element = document.getElementById('tabla');
      const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
      const book: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, worksheet, 'tabla');
      XLSX.writeFile(book, 'tabla-usuarios.xlsx');
    })
    setTimeout(() => {
      this.excel = false;
    })
  }
}
