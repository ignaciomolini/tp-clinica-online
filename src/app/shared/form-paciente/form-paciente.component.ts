import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { arch } from 'os';
import { Paciente } from 'src/app/models/paciente';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-form-paciente',
  templateUrl: './form-paciente.component.html',
  styleUrls: ['./form-paciente.component.css']
})
export class FormPacienteComponent implements OnInit {
  formRegister: FormGroup;
  mostrarImagenUno: any = 'https://cdn-icons-png.flaticon.com/128/1946/1946429.png';
  mostrarImagenDos: any = 'https://cdn-icons-png.flaticon.com/128/1946/1946429.png';
  imagenUno: any;
  imagenDos: any;
  @Input() mostrarLoading: boolean = false;
  @Output() paciente = new EventEmitter<Paciente>()

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private toastr: ToastrService) {
    this.formRegister = this.fb.group({
      nombre: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/), Validators.minLength(3)]),
      apellido: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/),
      Validators.minLength(3)]),
      edad: new FormControl('', [Validators.required, Validators.min(1), Validators.max(99),
      Validators.pattern(/^\d+$/)]),
      dni: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      obraSocial: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      foto1: new FormControl('', [Validators.required]),
      foto2: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  async enviarPaciente() {
    try {
      this.mostrarLoading = true;
      const paciente: Paciente = this.formRegister.getRawValue();
      paciente.nombre = this.pasarAMayus(paciente.nombre);
      paciente.apellido = this.pasarAMayus(paciente.apellido);
      paciente.obraSocial = this.pasarAMayus(paciente.obraSocial);
      paciente.foto1 = await this.usuarioService.subirImagen(this.imagenUno,
        `fotos-perfil/pacientes/1-${paciente.dni}-${Date.now()}`);
      paciente.foto2 = await this.usuarioService.subirImagen(this.imagenDos,
        `fotos-perfil/pacientes/2-${paciente.dni}-${Date.now()}`);
      paciente.activo = true;
      paciente.rol = 'paciente';
      this.paciente.emit(paciente);
    } catch(err:any) {
      this.toastr.error(err.message, "Error", {
        timeOut: 3000
      });
    } finally{
      this.mostrarLoading = false;
    }
  }

  pasarAMayus(frase: string){
    let palabras = frase.split(' ');
    for (let i = 0; i < palabras.length; i++) {
      palabras[i] = palabras[i][0].toUpperCase() + palabras[i].substring(1);
    }
    return palabras.join(' ');
  }

  cargarImagen(event: any, imagen: number) {
    let archivos = event.target.files;
    if (archivos.length > 0) {
      let reader = new FileReader();
      reader.readAsDataURL(archivos[0]);
      reader.onloadend = () => {
        if (imagen === 1) {
          this.mostrarImagenUno = reader.result;
          this.imagenUno = archivos[0];
        } else {
          this.mostrarImagenDos = reader.result;
          this.imagenDos = archivos[0];
        }
      }
    } else {
      if (imagen === 1) {
        this.mostrarImagenUno = 'https://cdn-icons-png.flaticon.com/128/1946/1946429.png';
      } else {
        this.mostrarImagenDos = 'https://cdn-icons-png.flaticon.com/128/1946/1946429.png';
      }
    }
  }
}
