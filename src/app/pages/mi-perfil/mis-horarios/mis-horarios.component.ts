import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Especialista } from 'src/app/models/especialista';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-horarios',
  templateUrl: './mis-horarios.component.html',
  styleUrls: ['./mis-horarios.component.css']
})
export class MisHorariosComponent implements OnInit {
  @Input() especialista: Especialista = {} as Especialista;
  agregarHorario: boolean = false;
  estado: string = 'especialidades';
  dias: string[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  horas: string[] = [];
  especialidad: string = '';
  dia: number = 0;
  desde: number = 0;
  hasta: number = 0;
  captcha?: string;

  constructor(private toastr: ToastrService, private usuarioService: UsuarioService) {
  }

  ngOnInit(): void {
  }

  cargarCaptcha(captcha: string) {
    this.captcha = captcha;
  }

  setearEspecialidad(especialidad: string) {
    this.estado = 'dias';
    this.especialidad = especialidad;
  }

  setearDia(dia: number) {
    this.estado = 'desde';
    this.dia = dia;
    if (dia == 6) {
      this.horas = this.intervaloHora(8, 13);
    } else {
      this.horas = this.intervaloHora(8, 18);
    }
  }

  setearHoraDesde(desde: string) {
    this.estado = 'hasta';
    this.desde = parseInt(desde);
    if (this.dia == 6) {
      this.horas = this.intervaloHora(this.desde + 1, 14);
    } else {
      this.horas = this.intervaloHora(this.desde + 1, 19);
    }
  }

  setearHoraHasta(hasta: string) {
    if (this.captcha) {
      this.captcha = undefined;
      this.hasta = parseInt(hasta);
      if (this.comprobarHorario()) {
        Swal.fire({
          icon: 'question',
          title: 'Desea registrar dia?',
          html:
            `<ul class="list-group p-3">
                <li class="list-group-item"><b>Dia:</b> ${this.dias[this.dia - 1]}</li>
                <li class="list-group-item"><b>Desde:</b> ${this.desde}:00</li> 
                <li class="list-group-item"><b>Hasta:</b> ${this.hasta}:00</li> 
             </ul>`,
          showDenyButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: 'Cerrar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.agregarrHorario();
          }
          this.agregarHorario = false
        }).catch((error: any) => {
          this.toastr.error(error.message, "Error", {
            timeOut: 3000
          });
        })
      } else {
        this.toastr.error("La franja horaria esta ocupada por otra especialidad", "Error", {
          timeOut: 3000
        });
      }
    }
  }

  agregarrHorario() {
    let existeDia = false;
    this.especialista.especialidad.forEach((e, i) => {
      if (!e.horarios) {
        e.horarios = []
      }
      if (e.nombre == this.especialidad) {
        this.especialista.especialidad[i].horarios?.forEach(horario => {
          if (horario.dia == this.dia) {
            existeDia = true;
            horario.desde = this.desde;
            horario.hasta = this.hasta;
          }
        })
        if (!existeDia) {
          this.especialista.especialidad[i].horarios?.push({ dia: this.dia, desde: this.desde, hasta: this.hasta })
        }
        this.usuarioService.modificarUsuario(this.especialista.idDb || '', this.especialista);
      }
    })
  }

  comprobarHorario() {
    this.estado = 'dias';
    let retorno = true;
    this.especialista.especialidad.forEach(e => {
      if (e.nombre != this.especialidad) {
        e.horarios?.forEach(horario => {
          if (horario.dia == this.dia && (this.desde >= horario.desde && this.desde < horario.hasta) ||
            (this.hasta > horario.desde && this.hasta <= horario.hasta)) {
            retorno = false;
          }
        })
      }
    })
    return true;
  }

  intervaloHora(horaInicio: number, horaFin: number) {
    let intervalo = (horaFin - horaInicio);
    let arrayHoras = []

    for (let i = 0; i <= intervalo; i++) {
      arrayHoras.push(`${horaInicio}:00`);
      horaInicio++;
    }
    return arrayHoras;
  }

}
