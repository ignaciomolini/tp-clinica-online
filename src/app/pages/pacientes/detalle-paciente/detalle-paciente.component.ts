import { Component, Input, OnInit } from '@angular/core';
import { Especialista } from 'src/app/models/especialista';
import { Paciente } from 'src/app/models/paciente';
import { Turno } from 'src/app/models/turno';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
  selector: 'app-detalle-paciente',
  templateUrl: './detalle-paciente.component.html',
  styleUrls: ['./detalle-paciente.component.css']
})
export class DetallePacienteComponent implements OnInit {
  @Input() paciente: Paciente = {} as Paciente;
  @Input() especialista: Especialista = {} as Especialista;
  turnosPaciente: Turno[] = [];
  sinHistoriaClinica: boolean = true;

  constructor(private turnoService: TurnoService) { }

  ngOnInit(): void {
    this.turnoService.traerTodosLosTurnos().subscribe((turnos: Turno[]) => {
      let turnosPacienteEspecialista = turnos.filter(t => t.paciente.uid == this.paciente.uid && t.especialista.uid == this.especialista.uid);
      turnosPacienteEspecialista.sort(function(a, b) {
        if (a.fecha > b.fecha) {
          return -1;
        }
        if (a.fecha < b.fecha) {
          return 1;
        }
        return 0;
      });
      this.turnosPaciente = turnosPacienteEspecialista.slice(0, 4);
      this.sinHistoriaClinica = true;
      this.turnosPaciente.forEach(turno => {
        if(turno.historiaClinica){
          this.sinHistoriaClinica = false;
        }
      })
    })
  }

}
