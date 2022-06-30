import { formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable } from 'rxjs';
import { Turno } from 'src/app/models/turno';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-grafico-turnos-dia',
  templateUrl: './grafico-turnos-dia.component.html',
  styleUrls: ['./grafico-turnos-dia.component.css']
})
export class GraficoTurnosDiaComponent implements OnInit {
  @Input() datos: Observable<any> = new Observable();
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  fechaDesde: string = '';
  fechaHasta: string = '';
  fecha: string = '';
  imagen: any = '../../../assets/images/logo.png';
  turnos: Turno[] = [];
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
      arrayFechas.forEach(fecha => {
        let contador = 0;
        this.turnos.forEach(turno => {
          if (fecha.setHours(0, 0, 0, 0) == new Date(turno.fecha).setHours(0, 0, 0, 0)) {
            contador++;
          }
        })
        if (contador > 0) {
          this.chartData.labels?.push(fecha.toLocaleString().split(',')[0]);
          this.chartData.datasets[0].data.push(contador);
          this.chart?.update();
        }
      })
    }
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
    doc.text('Cantidad de turnos por dia', 45, 40);
    doc.setFontSize(15);
    doc.text(`Desde: ${formatDate(this.fechaDesde, 'dd/MM/yyyy', 'en_US')}`, 60, 50);
    doc.text(`Hasta: ${formatDate(this.fechaHasta, 'dd/MM/yyyy', 'en_US')}`, 110, 50);
    doc.setFont('times', 'italic');
    doc.setFontSize(13);
    doc.text(this.fecha, 4, 10);
    doc.setFontSize(20);
    doc.addImage(this.imagen, 'JPEG', 193, 2, 15, 15);
    const grafico: any = document.getElementById('graficoDia');
    const options = {
      backgroundColor: 'rgba(74, 116, 170, 0.5)',
      scale: 3
    }
    await html2canvas(grafico, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      const bufferX = 5;
      const bufferY = 60;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    })
    doc.output('dataurlnewwindow', { filename: 'turnos-por-dia' });
  }
}
