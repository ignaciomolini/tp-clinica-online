import { Component, Input, OnInit } from '@angular/core';
import { Paciente } from 'src/app/models/paciente';
import { Turno } from 'src/app/models/turno';
import { TurnoService } from 'src/app/services/turno.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {
  @Input() paciente: Paciente = {} as Paciente;
  @Input() modo: string = 'completa';
  @Input() turno: Turno = {} as Turno;
  listaHistoriaClinica: any[] = [];
  imagen: any = '../../../assets/images/logo.png';
  fecha: string;

  constructor(private turnoService: TurnoService) {
    this.fecha = new Date().toLocaleString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  ngOnInit(): void {
    this.turnoService.traerTodosLosTurnos().subscribe(turnos => {
      this.listaHistoriaClinica.length = 0;
      if (this.modo == 'completa') {
        turnos.forEach((t: Turno) => {
          if (t.paciente.uid == this.paciente.uid && t.historiaClinica) {
            this.listaHistoriaClinica.push({ historiaClinica: t.historiaClinica, fecha: t.fecha, especialidad: t.especialidad, especialista: `${t.especialista.nombre} ${t.especialista.apellido}` })
          }
        })
      } else if (this.modo == 'turno') {
        this.listaHistoriaClinica.push({ historiaClinica: this.turno.historiaClinica, fecha: this.turno.fecha, especialidad: this.turno.especialidad, especialista: `${this.turno.especialista.nombre} ${this.turno.especialista.apellido}` })
      }
    })
  }

  async crearPdf() {
    let doc = new jsPDF();
    doc.setFontSize(40);
    doc.text('Historia clínica', 60, 40);
    doc.setFont('times', 'italic');
    doc.setFontSize(13);
    doc.text(this.fecha, 4, 10);
    doc.setFontSize(20);
    doc.text(`${this.paciente.nombre} ${this.paciente.apellido}`, 90, 55)
    doc.addImage(this.imagen, 'JPEG', 193, 2, 15, 15);
    let heightAnterior = 0;
    for (let i = 0; i < this.listaHistoriaClinica.length; i++) {
      const tabla: any = document.getElementById(`tabla${i}`);
      const options = {
        backgroundColor: 'black',
        scale: 3
      }
      await html2canvas(tabla, options).then((canvas) => {
        const img = canvas.toDataURL('image/PNG');
        const bufferX = 5;
        const bufferY = 70 + heightAnterior;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        heightAnterior += pdfHeight + 5;
        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      })
    }
    doc.output('dataurlnewwindow', { filename: `historia-clinica-${this.paciente.nombre}-${this.paciente.apellido}` });
    return true;
  }

}
