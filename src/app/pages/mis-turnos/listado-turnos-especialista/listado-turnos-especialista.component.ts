import { Component, Input, OnInit } from '@angular/core';
import { Especialista } from 'src/app/models/especialista';
import { Turno } from 'src/app/models/turno';

@Component({
  selector: 'app-listado-turnos-especialista',
  templateUrl: './listado-turnos-especialista.component.html',
  styleUrls: ['./listado-turnos-especialista.component.css']
})
export class ListadoTurnosEspecialistaComponent implements OnInit {
  @Input() especialista?: Especialista;
  @Input() turnosEspecialista: any;
  turnosEspecialistaFiltrado: Turno[] = [];
  turnosEspecialistaCompleto: Turno[] = [];
  filtro: string = '';
  listaFiltradaVacia: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.turnosEspecialista.subscribe((turnos: any) => {
      this.turnosEspecialistaFiltrado = this.turnosEspecialistaFiltrado.concat(turnos);
      this.turnosEspecialistaCompleto = turnos;
    })
  }

  mostrarTodos(){
    this.turnosEspecialistaFiltrado = this.turnosEspecialistaCompleto.slice();
    this.listaFiltradaVacia = false;
  }

  mostrarFiltrado(filtro: string){
    this.turnosEspecialistaFiltrado = this.turnosEspecialistaCompleto.filter(t => {
      return t.especialidad.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
      t.paciente.nombre.toLowerCase().includes(filtro.toLowerCase())
    })
    this.listaFiltradaVacia = false;
    if(this.turnosEspecialistaFiltrado.length == 0){
      this.listaFiltradaVacia = true;
    }
    this.filtro = '';
  }
}
