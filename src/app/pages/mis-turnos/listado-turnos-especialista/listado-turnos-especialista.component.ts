import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Especialista } from 'src/app/models/especialista';
import { HistoriaClinica } from 'src/app/models/historia-clinica';
import { estadoTurno, Turno } from 'src/app/models/turno';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
  selector: 'app-listado-turnos-especialista',
  templateUrl: './listado-turnos-especialista.component.html',
  styleUrls: ['./listado-turnos-especialista.component.css']
})
export class ListadoTurnosEspecialistaComponent implements OnInit {
  @Input() especialista?: Especialista;
  @Input() turnosEspecialista: any;
  turnoSeleccionado: Turno = {} as Turno;
  formCancelar: FormGroup;
  formRechazar: FormGroup;
  formFinalizar: FormGroup;
  estado: string = 'tabla';
  estadoTurno = estadoTurno;
  turnosEspecialistaFiltrado: Turno[] = [];
  turnosEspecialistaCompleto: Turno[] = [];
  filtro: string = '';
  inputDisabled: boolean = true;
  listaFiltradaVacia: boolean = false;
  captchaAceptar?: string;

  constructor(private fb: FormBuilder, private turnoService: TurnoService, private toastr: ToastrService) {
    this.formCancelar = this.fb.group({
      comentario: new FormControl('', [Validators.required]),
      captcha: new FormControl('', [Validators.required])
    });
    this.formRechazar = this.fb.group({
      comentario: new FormControl('', [Validators.required]),
      captcha: new FormControl('', [Validators.required])
    });
    this.formFinalizar = this.fb.group({
      altura: new FormControl('', [Validators.required, Validators.min(0.1), Validators.max(3),
      Validators.pattern(/^[0-9]$|^[0-9]\.[0-9]{1,3}$/)]),
      peso: new FormControl('', [Validators.required, Validators.min(0.1), Validators.max(400),
      Validators.pattern(/^[0-9]{1,3}$|^[0-9]{1,3}\.[0-9]{1,3}$/)]),
      temperatura: new FormControl('', [Validators.required, Validators.min(30), Validators.max(45),
      Validators.pattern(/^[0-9]{1,2}$|^[0-9]{1,2}\.[0-9]{1,3}$/)]),
      presion: new FormControl('', [Validators.required, Validators.min(0), Validators.max(200),
      Validators.pattern(/^[0-9]{1,3}\/[0-9]{1,3}$/)]),
      clave1: new FormControl(null), clave2: new FormControl(null), clave3: new FormControl(null),
      clave4: new FormControl(null), clave5: new FormControl(null), clave6: new FormControl(null),
      valor1: new FormControl(null), valor2: new FormControl(null), valor3: new FormControl(null),
      valor4: new FormControl(null), valor5: new FormControl(null), valor6: new FormControl(null),
      resenia: new FormControl('', [Validators.required, Validators.minLength(5)]),
      captcha: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.turnosEspecialista.subscribe((turnos: Turno[]) => {
      this.turnosEspecialistaFiltrado = turnos.slice();
      this.turnosEspecialistaCompleto = turnos;
    })
  }

  cargarCaptchaCancelar(captcha: string) {
    this.formCancelar.controls['captcha'].setValue(captcha);
  }

  cargarCaptchaRechazar(captcha: string) {
    this.formRechazar.controls['captcha'].setValue(captcha);
  }

  cargarCaptchaAceptar(captcha: string) {
    this.captchaAceptar = captcha;
  }

  cargarCaptchaFinalizar(captcha: string) {
    this.formFinalizar.controls['captcha'].setValue(captcha);
  }

  mostrarFiltrado(filtro: string) {
    this.turnosEspecialistaFiltrado = this.turnosEspecialistaCompleto.filter(t => {
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
        t.paciente.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        t.paciente.apellido.toLowerCase().includes(filtro.toLowerCase()) ||
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
    if (this.turnosEspecialistaFiltrado.length == 0) {
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

  rechazarTurno() {
    let comentario = this.formCancelar.controls['comentario'].value
    this.turnoSeleccionado.comentarioRechazo = comentario;
    this.turnoSeleccionado.estado = estadoTurno.rechazado;
    this.turnoService.modificarTurno(this.turnoSeleccionado.idDb || '', this.turnoSeleccionado).then(() => {
      this.toastr.success("Se rechazo el turno", "Ok", {
        timeOut: 2000
      });
    }).catch(() => {
      this.toastr.error("No se pudo rechazar el turno", "Error", {
        timeOut: 2000
      });
    }).finally(() => {
      this.estado = 'tabla';
    })
  }

  aceptarTurno() {
    this.turnoSeleccionado.estado = estadoTurno.aceptado;
    this.turnoService.modificarTurno(this.turnoSeleccionado.idDb || '', this.turnoSeleccionado).then(() => {
      this.toastr.success("Se acepto el turno", "Ok", {
        timeOut: 2000
      });
    }).catch(() => {
      this.toastr.error("No se pudo aceptar el turno", "Error", {
        timeOut: 2000
      });
    }).finally(() => {
      this.estado = 'tabla';
    })

  }

  actualizarInput() {
    if (!this.formFinalizar.controls['clave1'].value || !this.formFinalizar.controls['valor1'].value) {
      this.formFinalizar.controls['valor1'].reset();
      this.formFinalizar.controls['clave2'].reset();
      this.formFinalizar.controls['valor2'].reset();
      this.formFinalizar.controls['clave3'].reset();
      this.formFinalizar.controls['valor3'].reset();
    }
    if (!this.formFinalizar.controls['clave2'].value || !this.formFinalizar.controls['valor2'].value) {
      this.formFinalizar.controls['valor2'].reset();
      this.formFinalizar.controls['clave3'].reset();
      this.formFinalizar.controls['valor3'].reset();
    }
    if (!this.formFinalizar.controls['clave3'].value || !this.formFinalizar.controls['valor3'].value) {
      this.formFinalizar.controls['valor3'].reset();
    }
    if (!this.formFinalizar.controls['clave4'].value) {
      this.formFinalizar.controls['valor4'].reset();
    }
    if (!this.formFinalizar.controls['clave5'].value) {
      this.formFinalizar.controls['valor5'].reset();
    }
    if (!this.formFinalizar.controls['clave6'].value) {
      this.formFinalizar.controls['valor6'].reset();
    }
  }

  finalizarTurno() {
    const formulario = this.formFinalizar.getRawValue();
    this.turnoSeleccionado.historiaClinica = {} as HistoriaClinica;
    this.turnoSeleccionado.historiaClinica.altura = formulario.altura;
    this.turnoSeleccionado.historiaClinica.peso = formulario.peso;
    this.turnoSeleccionado.historiaClinica.temperatura = formulario.temperatura;
    this.turnoSeleccionado.historiaClinica.presion = formulario.presion;
    const datosDinamicos: any[] = [];
    if (formulario.valor1 != null) {
      datosDinamicos.push({ clave1: formulario.clave1, valor1: formulario.valor1 });
    }
    if (formulario.valor2 != null) {
      datosDinamicos.push({ clave2: formulario.clave2, valor2: formulario.valor2 });
    }
    if (formulario.valor3 != null) {
      datosDinamicos.push({ clave3: formulario.clave3, valor3: formulario.valor3 });
    }
    if (formulario.valor4 != null) {
      datosDinamicos.push({ clave4: formulario.clave4, valor4: formulario.valor4 });
    }
    if (formulario.valor5 != null) {
      datosDinamicos.push({ clave5: formulario.clave5, valor5: formulario.valor5 });
    }
    if (formulario.valor6 != null) {
      datosDinamicos.push({ clave6: formulario.clave6, valor6: formulario.valor6 ? 'si' : 'no' });
    }
    if (datosDinamicos.length > 0) {
      this.turnoSeleccionado.historiaClinica.datosDinamicos = datosDinamicos;
    }
    this.turnoSeleccionado.resenia = formulario.resenia;
    this.turnoSeleccionado.estado = estadoTurno.finalizado;
    this.turnoService.modificarTurno(this.turnoSeleccionado.idDb || '', this.turnoSeleccionado).then(() => {
      this.toastr.success("Se finalizo el turno", "Ok", {
        timeOut: 2000
      });
    }).catch(() => {
      this.toastr.error("No se pudo finalizar el turno", "Error", {
        timeOut: 2000
      });
    }).finally(() => {
      this.estado = 'tabla';
    })
  }
}
