import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { estadoTurno, Turno } from 'src/app/models/turno';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css'],
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
export class TurnosComponent implements OnInit {
  filtro: string = '';
  estado: string = 'tabla';
  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  estadoTurno = estadoTurno;
  turnoSeleccionado: Turno = {} as Turno;
  listaFiltradaVacia: boolean = false;
  formCancelar: FormGroup;

  constructor(private turnoService: TurnoService, private fb: FormBuilder, private toastr: ToastrService) {
    this.formCancelar = this.fb.group({
      comentario: new FormControl('', [Validators.required]),
    });
   }

  ngOnInit(): void {
    this.turnoService.traerTodosLosTurnos().subscribe(turnos => {
      this.turnosFiltrados = turnos.slice();
      this.turnos = turnos;
    })
  }

  mostrarFiltrado(filtro: string){
    this.turnosFiltrados = this.turnos.filter(t => {
      return t.especialidad.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        t.especialista.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        t.especialista.apellido.toLowerCase().includes(filtro.toLowerCase())||
        t.paciente.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        t.paciente.apellido.toLowerCase().includes(filtro.toLowerCase())
    })
    this.listaFiltradaVacia = false;
    if (this.turnosFiltrados.length == 0) {
      this.listaFiltradaVacia = true;
    }
  }

  cancelarTurno(){
    let comentario = this.formCancelar.controls['comentario'].value
    this.turnoSeleccionado.comentarioCancelacion = comentario;
    this.turnoSeleccionado.estado = estadoTurno.cancelado;
    this.turnoService.modificarTurno(this.turnoSeleccionado.idDb || '', this.turnoSeleccionado).then(() => {
      this.toastr.success("Se cancelo el turno", "Ok", {
        timeOut: 2000
      });
    }).catch(() => {
      this.toastr.error("No se pudo cancelar el turno", "Error", {
        timeOut: 2000
      });
    }).finally(() => {
      this.estado = 'tabla';
    })
  }

}
