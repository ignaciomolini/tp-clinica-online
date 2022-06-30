import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, style, transition, animate, state } from '@angular/animations';
import { UsuarioService } from 'src/app/services/usuario.service';
import { HistoriaClinicaComponent } from 'src/app/shared/historia-clinica/historia-clinica.component';
import { Especialidad } from 'src/app/models/especialidad';
import { Turno } from 'src/app/models/turno';
import { TurnoService } from 'src/app/services/turno.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css'],
  animations: [
    trigger('entrada', [
      state('void', style({
        transform: 'translateY(-50%)',
        opacity: 0
      })),
      transition(':enter', [
        animate("1s cubic-bezier(.17,.67,.88,.1)")
      ])
    ]),
    trigger('entrada2', [
      state('void', style({
        transform: 'translateY(+50%)',
        opacity: 0
      })),
      transition(':enter', [
        animate("1s cubic-bezier(.17,.67,.88,.1)")
      ])
    ])
  ]
})
export class MiPerfilComponent implements OnInit {
  usuario: any;
  imagen: any = '../../../assets/images/logo.png';
  fecha: string;
  @ViewChild('hc') historiaClinica?: HistoriaClinicaComponent;
  cargandoPdf: boolean = true;
  mostrarTurnosEspecialidad: boolean = false;
  especialidadSeleccionada: string = '';
  turnosEspecialidad: Turno[] = [];

  constructor(private usuarioService: UsuarioService, private turnoService: TurnoService) {
    let uidLocalStore = JSON.parse(localStorage.getItem('usuario') || '').uid;
    this.usuarioService.traerTodosLosUsuarios().subscribe(usuarios => {
      usuarios.forEach(u => {
        if (u.uid == uidLocalStore) {
          this.usuario = u;
        }
      })
    })
    this.fecha = new Date().toLocaleString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  ngOnInit(): void {
    this.getBase64ImageFromUrl(this.imagen).then(r => {
      this.imagen = r;
    });
  }

  mostrarTurnos(especialidad: Especialidad) {
    this.especialidadSeleccionada = especialidad.nombre;
    this.mostrarTurnosEspecialidad = true;
    this.turnoService.traerTodosLosTurnos().subscribe((turnos: Turno[]) => {
      this.turnosEspecialidad = turnos.filter(turno =>
        turno.especialidad.nombre == especialidad.nombre &&
        turno.especialista.uid == this.usuario.uid)
    })
  }

  async crearPdfTurnos() {
    this.cargandoPdf = false;
    let doc = new jsPDF();
    doc.setFontSize(40);
    doc.text(`Turnos`, 80, 40);
    doc.setFont('times', 'italic');
    doc.setFontSize(13);
    doc.text(this.fecha, 4, 10);
    doc.setFontSize(18);
    doc.text(`Especialista: ${this.usuario.nombre} ${this.usuario.apellido}`, 5, 55)
    doc.text(`Especialidad: ${this.especialidadSeleccionada}`, 5, 65)
    doc.addImage(this.imagen, 'JPEG', 193, 2, 15, 15);
    const tabla: any = document.getElementById(`tabla-turnos`);
    const options = {
      backgroundColor: 'black',
      scale: 3
    }
    await html2canvas(tabla, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      const bufferX = 5;
      const bufferY = 75 ;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    })
    doc.output('dataurlnewwindow', { filename: `turnos-${this.especialidadSeleccionada}-${this.usuario.nombre}-${this.usuario.apellido}` });
    this.cargandoPdf = true;
  }

  crearPdfHC() {
    this.cargandoPdf = false;
    this.historiaClinica?.crearPdf().then(resp => {
      this.cargandoPdf = resp;
    });
  }

  async getBase64ImageFromUrl(imageUrl: string) {
    const res = await fetch(imageUrl);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);
      reader.onerror = () => {
        reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }
}
