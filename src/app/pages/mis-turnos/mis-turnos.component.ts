import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, state } from '@angular/animations'
import { Turno } from 'src/app/models/turno';
import { TurnoService } from 'src/app/services/turno.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css'],
  animations: [
    trigger('entrada', [
      state('void', style({
        transform: 'translateY(-10%)',
        opacity: 0
      })),
      transition(':enter', [
        animate("1s ease-in")
      ])
    ])
  ]
})
export class MisTurnosComponent implements OnInit {
  usuario: any;
  turnosPaciente$ = new Subject<Turno[]>();
  turnosEspecialistas$ = new Subject<Turno[]>();

  constructor(private turnoService: TurnoService) {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '');
  }

  ngOnInit(): void {
    this.turnoService.traerTodosLosTurnos().subscribe(turnos => {
      this.turnosPaciente$.next(turnos.filter((t: Turno) => t.paciente.uid == this.usuario.uid));
      this.turnosEspecialistas$.next(turnos.filter((t: Turno) => t.especialista.uid == this.usuario.uid));
    })
  }

  enviarPacientes$(): Observable<Turno[]> {
    return this.turnosPaciente$.asObservable();
  }

  enviarEspecialistas$(): Observable<Turno[]> {
    return this.turnosEspecialistas$.asObservable();
  }
}
