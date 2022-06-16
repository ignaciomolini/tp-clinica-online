import { Component, Input, OnInit } from '@angular/core';
import { Paciente } from 'src/app/models/paciente';
import { Turno } from 'src/app/models/turno';

@Component({
  selector: 'app-listado-turnos-paciente',
  templateUrl: './listado-turnos-paciente.component.html',
  styleUrls: ['./listado-turnos-paciente.component.css']
})
export class ListadoTurnosPacienteComponent implements OnInit {
  @Input() paciente?: Paciente;
  @Input() turnosPaciente: any;
  turnosPacienteFiltrado: Turno[] = [];
  turnosPacienteCompleto: Turno[] = [];
  filtro: string = '';
  listaFiltradaVacia: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.turnosPaciente.subscribe((turnos: any) => {
      this.turnosPacienteFiltrado = this.turnosPacienteFiltrado.concat(turnos);
      this.turnosPacienteCompleto = turnos;
    })
  }

  mostrarTodos(){
    this.turnosPacienteFiltrado = this.turnosPacienteCompleto.slice();
    this.listaFiltradaVacia = false;
  }

  mostrarFiltrado(filtro: string){
    this.turnosPacienteFiltrado = this.turnosPacienteCompleto.filter(t => {
      return t.especialidad.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
      t.especialista.nombre.toLowerCase().includes(filtro.toLowerCase())
    })
    this.listaFiltradaVacia = false;
    if(this.turnosPacienteFiltrado.length == 0){
      this.listaFiltradaVacia = true;
    }
    this.filtro = '';
  }
}
