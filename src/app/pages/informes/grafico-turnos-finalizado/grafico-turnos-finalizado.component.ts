import { formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable } from 'rxjs';
import { Turno } from 'src/app/models/turno';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Especialista } from 'src/app/models/especialista';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-grafico-turnos-finalizado',
  templateUrl: './grafico-turnos-finalizado.component.html',
  styleUrls: ['./grafico-turnos-finalizado.component.css']
})
export class GraficoTurnosFinalizadoComponent implements OnInit {
  @Input() datos: Observable<any> = new Observable();
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  fechaDesde: string = '';
  fechaHasta: string = '';
  fecha: string = '';
  imagen: any = '../../../assets/images/logo.png';
  turnos: Turno[] = [];
  especialistas: Especialista[] = [];
  chartType: ChartType = 'bar';
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: 'white',
          font: {
            size: 16
          }
        }
      },
      y: {
        ticks: {
          color: 'white',
          font: {
            size: 16
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        color: 'white',
        font: {
          size: 16,
          weight: 700
        }
      }
    },
  };
  barChartPlugins = [
    DataLabelsPlugin
  ];
  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [], label: 'Cantidad'
      }
    ]
  };

  constructor() {
    this.fecha = new Date().toLocaleString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  ngOnInit(): void {
    this.datos.subscribe(datos => {
      this.turnos = datos.turnos;
      this.especialistas = datos.especialistas;
    })
  }

  cambiarFecha() {
    this.chartData.labels = [];
    this.chartData.datasets[0].data = [];
    this.chart?.update();
    if (this.fechaHasta >= this.fechaDesde) {
      let fechaDesde = formatDate(this.fechaDesde, 'yyyy-MM-dd 00:00:00', 'en_US');
      let fechaHasta = formatDate(this.fechaHasta, 'yyyy-MM-dd 24:00:00', 'en_US');
      let arrayFechas = this.traerDiasEntreFechas(new Date(fechaDesde), new Date(fechaHasta));

      this.especialistas.forEach(especialista => {
        let contador = 0;
        this.turnos.forEach(turno => {
          if (turno.estado == 'finalizado' && this.verificarTurnoEntreFechas(turno, arrayFechas) && turno.especialista.uid == especialista.uid) {
            contador++;
          }
        })
        this.chartData.labels?.push(`${especialista.nombre} ${especialista.apellido}`);
        this.chartData.datasets[0].data.push(contador);
        this.chart?.update();
      })
    }
  }

  verificarTurnoEntreFechas(turno: Turno, fechas: Date[]) {
    let retorno = false;
    fechas.forEach(fecha => {
      if (fecha.setHours(0, 0, 0, 0) == new Date(turno.fecha).setHours(0, 0, 0, 0)) {
        retorno = true;
      }
    })
    return retorno;
  }

  traerDiasEntreFechas(fechaInicio: Date, fechaFin: Date) {
    const arrayFechas: Date[] = [];
    const fecha = new Date(fechaInicio);
    while (fecha < fechaFin) {
      arrayFechas.push(new Date(fecha))
      fecha.setDate(fecha.getDate() + 1);
    }
    return arrayFechas;
  }

  async crearPdf() {
    let doc = new jsPDF();
    doc.setFontSize(30);
    doc.text('Cantidad de turnos finalizados', 40, 35);
    doc.text('por médico en un lapso de tiempo', 30, 45);
    doc.setFontSize(15);
    doc.text(`Desde: ${formatDate(this.fechaDesde, 'dd/MM/yyyy', 'en_US')}`, 60, 55);
    doc.text(`Hasta: ${formatDate(this.fechaHasta, 'dd/MM/yyyy', 'en_US')}`, 110, 55);
    doc.setFont('times', 'italic');
    doc.setFontSize(13);
    doc.text(this.fecha, 4, 10);
    doc.setFontSize(20);
    doc.addImage(this.imagen, 'JPEG', 193, 2, 15, 15);
    const grafico: any = document.getElementById('graficoFinalizado');
    const options = {
      backgroundColor: 'rgba(74, 116, 170, 0.5)',
      scale: 3
    }
    await html2canvas(grafico, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      const bufferX = 5;
      const bufferY = 65;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    })
    doc.output('dataurlnewwindow', { filename: 'turnos-finalziados' });
  }
}
