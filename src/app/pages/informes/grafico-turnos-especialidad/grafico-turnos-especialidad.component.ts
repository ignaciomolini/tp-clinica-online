import { Component, Input, OnInit } from '@angular/core';
import { IChartistData, IPieChartOptions, IResponsiveOptionTuple } from 'chartist';
import { ChartType } from 'ng-chartist';
import { Observable } from 'rxjs';
import { Especialidad } from 'src/app/models/especialidad';
import { Turno } from 'src/app/models/turno';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-grafico-turnos-especialidad',
  templateUrl: './grafico-turnos-especialidad.component.html',
  styleUrls: ['./grafico-turnos-especialidad.component.css']
})
export class GraficoTurnosEspecialidadComponent implements OnInit {
  @Input() datos: Observable<any> = new Observable();
  fecha: string = '';
  imagen: any = '../../../assets/images/logo.png';
  type: ChartType = 'Pie';
  data: IChartistData = {
    labels: [],
    series: []
  };
  options: IPieChartOptions = {
    width: '22rem',
    height: '22rem',
    chartPadding: 15
  };

  constructor() { 
    this.fecha = new Date().toLocaleString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  ngOnInit(): void {
    this.datos.subscribe(datos => {
      const arrayDataLabels: any[] = [];
      const arrayDataSeries: any[] = [];
      datos.especialidades.forEach((especialidad: Especialidad) => {
        let contadorTurnos = 0;
        datos.turnos.forEach((turno: Turno) => {
          if (turno.especialidad.id == especialidad.id) {
            contadorTurnos++;
          }
        });
        if (contadorTurnos > 0) {
          arrayDataLabels.push(`${especialidad.nombre} (${contadorTurnos})`);
          arrayDataSeries.push(contadorTurnos);
        }
      });
      this.data.labels = arrayDataLabels;
      this.data.series = arrayDataSeries;
    })
  }

  async crearPdf() {
    let doc = new jsPDF();
    doc.setFontSize(30);
    doc.text('Cantidad de turnos por especialidad', 20, 40);
    doc.setFontSize(15);
    doc.setFont('times', 'italic');
    doc.setFontSize(13);
    doc.text(this.fecha, 4, 10);
    doc.setFontSize(20);
    doc.addImage(this.imagen, 'JPEG', 193, 2, 15, 15);
    const grafico: any = document.getElementById('graficoEspecialidad');
    await html2canvas(grafico).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      const bufferX = 5;
      const bufferY = 60;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    })
    doc.output('dataurlnewwindow', { filename: 'turnos-por-especialida' });
  }
}
