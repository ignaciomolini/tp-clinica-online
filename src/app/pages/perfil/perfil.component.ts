import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, state } from '@angular/animations';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  animations: [
    trigger('entrada', [
      state('void', style({
        transform: 'translateY(-50%)',
        opacity: 0
      })),
      transition(':enter', [
        animate("1s cubic-bezier(.17,.67,.88,.1)")
      ])
    ])
  ]
})
export class PerfilComponent implements OnInit {
  usuario: any;
  imagen: any = '../../../assets/images/logo.png';
  fecha: string;

  constructor() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '');
    this.fecha = new Date().toLocaleString('es-AR', { year: 'numeric', month: 'long', day: 'numeric'});
  }

  ngOnInit(): void {
    this.getBase64ImageFromUrl(this.imagen).then(r => {
      this.imagen = r;
    });
  }

  crearPdf() {
    var doc = new jsPDF();
    doc.setFontSize(40)
    doc.text('Historia clínica', 60, 40)
    doc.setFont('times', 'italic')
    doc.setFontSize(13)
    doc.text(this.fecha, 4, 10)
    doc.addImage(this.imagen, 'JPEG', 193, 2, 15, 15);
    doc.save("a4.pdf"); 
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
