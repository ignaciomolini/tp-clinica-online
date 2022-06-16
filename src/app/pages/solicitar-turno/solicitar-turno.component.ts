import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, state } from '@angular/animations'
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Administrador } from 'src/app/models/administrador';
import { Especialidad } from 'src/app/models/especialidad';
import { Especialista } from 'src/app/models/especialista';
import { Paciente } from 'src/app/models/paciente';
import { Turno } from 'src/app/models/turno';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { TurnoService } from 'src/app/services/turno.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css'],
  animations: [
    trigger('entrada', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      transition(':enter', [
        animate("1s ease-in")
      ])
    ])
  ]
})
export class SolicitarTurnoComponent implements OnInit {
  usuarioActual: Paciente | Administrador;
  pacientes: Paciente[] = [];
  especialidades: Especialidad[] = [];
  especialistas: Especialista[] = [];
  especialistasPorEspecialidad: Especialista[] = [];
  turnos: Turno[] = [];
  dias: any[] = [];
  horas: any[] = [];
  horaElegida: any;
  diaElegido: any;
  especialidadElegida: Especialidad = { id: 0, nombre: '', imagen: '' };
  pacienteElegido?: Paciente;
  especialistaElegido?: Especialista;
  estado: string;

  constructor(private usuarioService: UsuarioService, private especialidadService: EspecialidadService,
    private turnoService: TurnoService, private toastr: ToastrService) {
    this.usuarioActual = JSON.parse(localStorage.getItem('usuario') || '');
    this.estado = (this.usuarioActual.rol == 'administrador') ? 'pacientes' : 'especialidades';
  }

  ngOnInit(): void {
    this.traerPacientes();
    this.traerEspecialidades();
    this.traerEspecialistas();
    this.traerTurnos()
  }

  traerPacientes() {
    this.usuarioService.traerTodosLosUsuarios().subscribe(usuarios => {
      this.pacientes = usuarios.filter(usuario => usuario.rol == 'paciente');
    })
  }

  traerEspecialidades() {
    this.especialidadService.traerTodasLasEspecialidades().subscribe(especialidades => {
      this.especialidades = especialidades;
    })
  }

  traerEspecialistas() {
    this.usuarioService.traerTodosLosUsuarios().subscribe(usuarios => {
      this.especialistas = usuarios.filter(usuario => usuario.rol == 'especialista');
    })
  }

  traerTurnos() {
    this.turnoService.traerTodosLosTurnos().subscribe(turnos => {
      this.turnos = turnos;
    })
  }

  elegirPaciente(paciente: Paciente) {
    this.pacienteElegido = paciente;
    this.estado = 'especialidades';
  }

  elegirEspecialidad(especialidad: Especialidad) {
    this.especialidadElegida = especialidad;
    this.especialistasPorEspecialidad = this.especialistas.filter(esp => {
      let resp = false;
      esp.especialidad.forEach((espe) => {
        if (espe.nombre == especialidad.nombre) {
          resp = true;
        }
      })
      return resp;
    })
    this.estado = 'especialistas';
  }

  elegirEspecialista(especialista: Especialista) {
    this.especialistaElegido = especialista;
    this.dias = this.setearDiasDisponibles(especialista.uid);
    this.estado = 'dias';
  }

  elegirDia(dia: Date) {
    this.diaElegido = dia;
    this.horas = this.setearHorasDisponibles(this.especialistaElegido?.uid || '', dia);
    this.estado = 'horas';
  }

  async elegirHora(hora: string) {
    this.horaElegida = hora;
    if (this.usuarioActual.rol == 'paciente') {
      this.pacienteElegido = this.usuarioActual as Paciente
    }
    Swal.fire({
      icon: 'question',
      title: 'Desea guardar su turno?',
      html:
        `<ul class="list-group p-3">
            <li class="list-group-item"><b>Especialidad:</b> ${this.especialidadElegida?.nombre}</li>
            <li class="list-group-item"><b>Paciente:</b> ${this.pacienteElegido?.nombre} ${this.pacienteElegido?.apellido}</li> 
            <li class="list-group-item"><b>Especialista:</b> ${this.especialistaElegido?.nombre} 
            ${this.especialistaElegido?.apellido}</li> 
            <li class="list-group-item"><b>Dia:</b> ${this.diaElegido?.toLocaleDateString("es", {
          weekday: "long",
          month: "long",
          day: "numeric"
        })}</li>
            <li class="list-group-item"><b>Hora:</b> ${this.horaElegida}</li>
            </ul>`,
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: 'Cerrar',
    }).then((result) => {
      if (result.isConfirmed) {
        const turno: Turno = {
          especialista: this.especialistaElegido || {} as Especialista, paciente: this.pacienteElegido
          || {} as Paciente, especialidad: this.especialidadElegida, estado: 'pendiente', fecha: new Date(`${this.diaElegido?.toDateString()}, ${hora}`).getTime()
        }
        this.turnoService.agregarTurno(turno).then(() => Swal.fire('Su turno ha sido guardado', '', 'success'))
          .catch((error: any) => {
            this.toastr.error(error.message, "Error", {
              timeOut: 3000
            });
          })
      }
      this.estado = (this.usuarioActual.rol == 'administrador') ? 'pacientes' : 'especialidades';
    }).catch((error: any) => {
      this.toastr.error(error.message, "Error", {
        timeOut: 3000
      });
    })

  }

  setearDiasDisponibles(uidEspecialista: string) {
    const turnosEspecialista = this.turnos.filter(t => t.especialista?.uid == uidEspecialista);
    const dias = this.traerDiasMenosDomingo(new Date(), new Date().setDate(new Date().getDate() + 15));
    let horasSemana = this.intervaloHora('8:00', '19:00');
    let horasSabado = this.intervaloHora('8:00', '14:00');

    const diasDisponibles = dias.filter(dia => {
      let horasOcupadas: string[] = [];
      if (dia.getDay() != 6) {
        turnosEspecialista.forEach((turno: Turno) => {
          let fecha = new Date(turno.fecha);
          let minutos = (fecha.getMinutes() == 0) ? '00' : '30';
          if (fecha.toDateString() == dia.toDateString()
            && horasSemana.includes(`${fecha.getHours()}:${minutos}`)) {
            horasOcupadas.push(`${fecha.getHours()}:${minutos}`);
          }
        })
        return horasSemana.filter(e => !horasOcupadas.includes(e)).length > 0;
      } else {
        this.setearHorasDisponibles(uidEspecialista, dia)
        turnosEspecialista.forEach((turno: Turno) => {
          let fecha = new Date(turno.fecha);
          let minutos = (fecha.getMinutes() == 0) ? '00' : '30';
          if (fecha.toDateString() == dia.toDateString()
            && horasSabado.includes(`${fecha.getHours()}:${minutos}`)) {
            horasOcupadas.push(`${fecha.getHours()}:${minutos}`);
          }
        })
        return horasSabado.filter(e => !horasOcupadas.includes(e)).length > 0;
      }
    });
    return diasDisponibles;
  }

  setearHorasDisponibles(uidEspecialista: string, dia: Date) {
    const turnosEspecialista = this.turnos.filter(t => t.especialista?.uid == uidEspecialista);
    const horasSemana = this.intervaloHora('8:00', '18:00');
    const horasSabado = this.intervaloHora('8:00', '14:00');
    const horasOcupadas: string[] = [];
    let horasDisponibles: string[] = [];

    if (dia.getDay() != 6) {
      turnosEspecialista.forEach((turno: Turno) => {
        let fecha = new Date(turno.fecha);
        let minutos = (fecha.getMinutes() == 0) ? '00' : '30';
        if (fecha.toDateString() == dia.toDateString() && horasSemana.includes(`${fecha.getHours()}:${minutos}`)) {
          horasOcupadas.push(`${fecha.getHours()}:${minutos}`);
        }
      })
      horasDisponibles = horasSemana.filter(e => !horasOcupadas.includes(e));
    } else {
      turnosEspecialista.forEach((turno: Turno) => {
        let fecha = new Date(turno.fecha);
        let minutos = (fecha.getMinutes() == 0) ? '00' : '30';
        if (fecha.toDateString() == dia.toDateString() && horasSabado.includes(`${fecha.getHours()}:${minutos}`)) {
          horasOcupadas.push(`${fecha.getHours()}:${minutos}`);
        }
      })
      horasDisponibles = horasSabado.filter(e => !horasOcupadas.includes(e));
    }
    return horasDisponibles;
  }


  intervaloHora(horaInicio: string, horaFin: string) {
    let horaFinal = parseInt(horaFin.split(':')[0])
    let horaInicial = parseInt(horaInicio.split(':')[0]);
    let intervalo = (horaFinal - horaInicial) * 2
    let minutos = horaInicio.split(':')[1];
    let arrayHoras = [`${horaInicial}:${minutos}`];

    for (let i = 0; i < intervalo; i++) {
      if (minutos == '00') {
        minutos = '30';
      } else {
        horaInicial++;
        minutos = '00';
      }
      arrayHoras.push(`${horaInicial}:${minutos}`);
    }
    arrayHoras.pop();
    return arrayHoras;
  }

  traerDiasMenosDomingo(fechaInicio: any, fechaFin: any) {
    let dias: Date[] = [];
    const fecha = new Date(fechaInicio);
    while (fecha < fechaFin) {
      if (fecha.getDay() != 0) {
        dias.push(new Date(fecha))
      }
      fecha.setDate(fecha.getDate() + 1);
    }
    return dias;
  }
}
