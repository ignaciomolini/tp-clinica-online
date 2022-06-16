import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Especialidad } from 'src/app/models/especialidad';
import { Especialista } from 'src/app/models/especialista';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-especialista',
  templateUrl: './form-especialista.component.html',
  styleUrls: ['./form-especialista.component.css']
})
export class FormEspecialistaComponent implements OnInit {
  formRegister: FormGroup;
  mostrarImagen: any = 'https://cdn-icons-png.flaticon.com/128/1946/1946429.png';
  imagen: any;
  especialidades: Especialidad[] = [];
  @Input() mostrarLoading: boolean = false;
  @Output() especialista = new EventEmitter<Especialista>()

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private especialidadService: EspecialidadService, private toastr: ToastrService) {
    this.formRegister = this.fb.group({
      nombre: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/), Validators.minLength(3)]),
      apellido: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/),
      Validators.minLength(3)]),
      edad: new FormControl('', [Validators.required, Validators.min(18), Validators.max(99),
      Validators.pattern(/^\d+$/)]),
      dni: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      especialidades: new FormArray([], [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      foto: new FormControl('', [Validators.required])
    })
  }

  onCheckboxChange(event: any) {
    const especialidades = (this.formRegister.controls['especialidades'] as FormArray);
    if (event.target.checked) {
      this.especialidades.forEach(esp => {
        if(event.target.value == esp.id){
          especialidades.push(new FormControl(esp));
        }
      })
    } else {
      const index = especialidades.controls.findIndex(x => x.value === event.target.value);
      especialidades.removeAt(index);
    }
  }

  ngOnInit(): void {
    this.especialidadService.traerTodasLasEspecialidades().subscribe(especialidades => {
      this.especialidades = especialidades;
    });
  }

  async enviarEspecialista() {
    try {
      this.mostrarLoading = true;
      const especialista: Especialista = this.formRegister.getRawValue();
      especialista.nombre = this.pasarAMayus(especialista.nombre);
      especialista.apellido = this.pasarAMayus(especialista.apellido);
      especialista.foto = await this.usuarioService.subirImagen(this.imagen,
        `fotos-perfil/especialistas/${especialista.dni}-${Date.now()}`);
      especialista.activo = false;
      especialista.rol = 'especialista';
      this.especialista.emit(especialista);
    } catch {
      this.toastr.error("Error al subir la imagen", "Error", {
        timeOut: 3000
      });
    } finally {
      this.mostrarLoading = false;
    }
  }


  async agregarNuevaEspecialidad() {
    let resp = false;
    try {
      let { value: especialidad } = await Swal.fire({
        title: 'Ingrese una especialidad',
        input: 'text'
      })
      especialidad = this.pasarAMayus(especialidad);
      this.especialidades.forEach(esp => {
        if (esp.nombre == especialidad) {
          resp = true;
        }
      })
      if (resp) {
        Swal.fire({
          icon: 'error',
          title: 'La especialidad ya existe'
        })
      } else {
        try {
          await this.especialidadService.agregarEspecialidad({ id: this.especialidades.length + 1, nombre: especialidad, imagen: 'https://cdn-icons.flaticon.com/png/512/6024/premium/6024831.png?token=exp=1655065566~hmac=5fd1ac60cf47d32705f88b663f943707' })
          Swal.fire({
            icon: 'success',
            title: 'Se agrego la especialidad'
          })
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error al agregar la especialidad'
          })
        }
      }
    } catch (error) {}
  }

  pasarAMayus(frase: string) {
    let palabras = frase.split(' ');
    for (let i = 0; i < palabras.length; i++) {
      palabras[i] = palabras[i][0].toUpperCase() + palabras[i].substring(1);
    }
    return palabras.join(' ');
  }

  cargarImagen(event: any) {
    let archivos = event.target.files;
    if (archivos.length > 0) {
      let reader = new FileReader();
      reader.readAsDataURL(archivos[0]);
      reader.onloadend = () => {
        this.mostrarImagen = reader.result;
        this.imagen = archivos[0];
      }
    } else {
      this.mostrarImagen = 'https://cdn-icons-png.flaticon.com/128/1946/1946429.png';
    }
  }
}
