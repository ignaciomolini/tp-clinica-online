import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Especialista } from 'src/app/models/especialista';
import { Paciente } from 'src/app/models/paciente';
import { Turno } from 'src/app/models/turno';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
  animations: [
    trigger('entrada', [
      state('void', style({
        transform: 'translateX(+10%)',
        opacity: 0
      })),
      transition(':enter', [
        animate("1s ease-in")
      ])
    ])
  ]
})
export class PacientesComponent implements OnInit {
  listaPacientes: Paciente[] = [];
  turnosDelEspecialista: Turno[] = [];
  especialista: Especialista = {} as Especialista;
  estado: string = 'tabla';
  pacienteSeleccionado: Paciente = {} as Paciente;

  constructor(private turnoService: TurnoService) {
  }

  ngOnInit(): void {
    this.especialista = JSON.parse(localStorage.getItem('usuario') || '')
    this.turnoService.traerTodosLosTurnos().subscribe(turnos => {
      this.turnosDelEspecialista.length = 0;
      turnos.forEach(t => {
        if (t.especialista.uid == this.especialista.uid) {
          this.turnosDelEspecialista.push(t);
        }
      })
      this.listaPacientes.length = 0;
      this.turnosDelEspecialista.forEach(turno => {
        if (!this.listaPacientes.find(paciente => paciente.uid == turno.paciente.uid)) {
          this.listaPacientes.push(turno.paciente);
        }
      })
    })
  }

  detalle(paciente: Paciente){
    this.estado = 'detalle';
    this.pacienteSeleccionado = paciente;
  } 
}
