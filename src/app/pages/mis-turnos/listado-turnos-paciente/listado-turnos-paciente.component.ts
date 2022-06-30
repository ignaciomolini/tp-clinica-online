import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Paciente } from 'src/app/models/paciente';
import { estadoTurno, Turno } from 'src/app/models/turno';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
  selector: 'app-listado-turnos-paciente',
  templateUrl: './listado-turnos-paciente.component.html',
  styleUrls: ['./listado-turnos-paciente.component.css']
})
export class ListadoTurnosPacienteComponent implements OnInit {
  @Input() paciente?: Paciente;
  @Input() turnosPaciente: any;
  formCancelar: FormGroup;
  formAtencion: FormGroup;
  formEncuesta: FormGroup;
  estado: string = 'tabla';
  estadoTurno = estadoTurno;
  turnoSeleccionado: Turno = {} as Turno;
  turnosPacienteFiltrado: Turno[] = [];
  turnosPacienteCompleto: Turno[] = [];
  filtro: string = '';
  listaFiltradaVacia: boolean = false;

  constructor(private fb: FormBuilder, private turnoService: TurnoService, private toastr: ToastrService) {
    this.formCancelar = this.fb.group({
      comentario: new FormControl('', [Validators.required]),
      captcha: new FormControl('', [Validators.required])
    });
    this.formAtencion = this.fb.group({
      comentario: new FormControl('', [Validators.required]),
      captcha: new FormControl('', [Validators.required])
    });
    this.formEncuesta = this.fb.group({
      preguntaPagina: new FormControl('', [Validators.required]),
      preguntaTurnos: new FormControl('', [Validators.required]),
      captcha: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.turnosPaciente.subscribe((turnos: Turno[]) => {
      this.turnosPacienteFiltrado = turnos.slice();
      this.turnosPacienteCompleto = turnos;
    })
  }

  cargarCaptchaCancelar(captcha: string){
    this.formCancelar.controls['captcha'].setValue(captcha);
  }

  cargarCaptchaAtencion(captcha: string){
    this.formAtencion.controls['captcha'].setValue(captcha);
  }

  cargarCaptchaEncuesta(captcha: string){
    this.formEncuesta.controls['captcha'].setValue(captcha);
  }

  mostrarTodos() {
    this.turnosPacienteFiltrado = this.turnosPacienteCompleto.slice();
    this.listaFiltradaVacia = false;
  }

  mostrarFiltrado(filtro: string) {
    this.turnosPacienteFiltrado = this.turnosPacienteCompleto.filter(t => {
      let datoDinamico1 = '';
      let datoDinamico2 = '';
      let datoDinamico3 = '';
      if (t.historiaClinica?.datosDinamicos && t.historiaClinica?.datosDinamicos[0]) {
        datoDinamico1 = t.historiaClinica?.datosDinamicos[0].valor1;
      }
      if (t.historiaClinica?.datosDinamicos && t.historiaClinica?.datosDinamicos[1]) {
        datoDinamico2 = t.historiaClinica?.datosDinamicos[1].valor2;
      }
      if (t.historiaClinica?.datosDinamicos && t.historiaClinica?.datosDinamicos[2]) {
        datoDinamico3 = t.historiaClinica?.datosDinamicos[2].valor3;
      }
      return t.especialidad.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        t.especialista.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        t.especialista.apellido.toLowerCase().includes(filtro.toLowerCase()) ||
        t.estado.toLowerCase().includes(filtro.toLowerCase()) ||
        t.historiaClinica?.altura.toLowerCase().includes(filtro.toLowerCase()) ||
        t.historiaClinica?.peso.toLowerCase().includes(filtro.toLowerCase()) ||
        t.historiaClinica?.temperatura.toLowerCase().includes(filtro.toLowerCase()) ||
        t.historiaClinica?.presion.toLowerCase().includes(filtro.toLowerCase()) ||
        datoDinamico1.toLowerCase().includes(filtro.toLowerCase()) ||
        datoDinamico2.toLowerCase().includes(filtro.toLowerCase()) ||
        datoDinamico3.toLowerCase().includes(filtro.toLowerCase())
    })
    this.listaFiltradaVacia = false;
    if (this.turnosPacienteFiltrado.length == 0) {
      this.listaFiltradaVacia = true;
    }
  }

  cancelarTurno() {
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

  guardarEncuesta() {
    this.turnoSeleccionado.encuesta = this.formEncuesta.getRawValue();
    this.turnoService.modificarTurno(this.turnoSeleccionado.idDb || '', this.turnoSeleccionado).then(() => {
      this.toastr.success("Encuesta enviada", "Ok", {
        timeOut: 2000
      });
    }).catch(() => {
      this.toastr.error("No se pudo enviar la encuesta", "Error", {
        timeOut: 2000
      });
    }).finally(() => {
      this.estado = 'tabla';
    })
  }

  calificarAtencion() {
    let comentario = this.formAtencion.controls['comentario'].value
    this.turnoSeleccionado.comentarioAtencion = comentario;
    this.turnoService.modificarTurno(this.turnoSeleccionado.idDb || '', this.turnoSeleccionado).then(() => {
      this.toastr.success("Se envio la calificacion", "Ok", {
        timeOut: 2000
      });
    }).catch(() => {
      this.toastr.error("No se pudo enviar la calificacion", "Error", {
        timeOut: 2000
      });
    }).finally(() => {
      this.estado = 'tabla';
    })
  }
}
