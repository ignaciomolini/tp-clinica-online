import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Administrador } from 'src/app/models/administrador';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-form-administrador',
  templateUrl: './form-administrador.component.html',
  styleUrls: ['./form-administrador.component.css']
})
export class FormAdministradorComponent implements OnInit {
  formAdministrador: FormGroup;
  mostrarImagen: any = 'https://cdn-icons-png.flaticon.com/128/1946/1946429.png';
  imagen: any;
  @Input() mostrarLoading: boolean = false;
  @Output() administrador = new EventEmitter<Administrador>()

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private toastr: ToastrService) {
    this.formAdministrador = this.fb.group({
      nombre: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/), Validators.minLength(3)]),
      apellido: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/),
      Validators.minLength(3)]),
      edad: new FormControl('', [Validators.required, Validators.min(18), Validators.max(99),
      Validators.pattern(/^\d+$/)]),
      dni: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      foto: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  async enviarAdministrador() {
    try {
      this.mostrarLoading = true;
      const administrador: Administrador = this.formAdministrador.getRawValue();
      administrador.nombre = this.pasarAMayus(administrador.nombre);
      administrador.apellido = this.pasarAMayus(administrador.apellido);
      administrador.foto = await this.usuarioService.subirImagen(this.imagen,
        `fotos-perfil/administradores/${administrador.dni}-${Date.now()}`);
      administrador.activo = true;
      administrador.rol = 'administrador';
      this.administrador.emit(administrador);
    } catch {
      this.toastr.error("Error al subir la imagen", "Error", {
        timeOut: 3000
      });
    } finally {
      this.mostrarLoading = false;
    }
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
