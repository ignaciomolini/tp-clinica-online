import { Component, Input, OnInit } from '@angular/core';
import { Turno } from 'src/app/models/turno';
import { TurnoService } from 'src/app/services/turno.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-detalle-usuarios',
  templateUrl: './detalle-usuarios.component.html',
  styleUrls: ['./detalle-usuarios.component.css']
})
export class DetalleUsuariosComponent implements OnInit {
  @Input() usuario: any;
  turnos: Turno[] = [];

  constructor(private turnoService: TurnoService) { }

  ngOnInit(): void {
    if (this.usuario.rol == 'paciente') {
      this.turnoService.traerTodosLosTurnos().subscribe((turnos: Turno[]) => {
        this.turnos = turnos.filter(t => t.paciente.uid == this.usuario.uid);
      })
    }
  }

  exportarAExcel() {
    let element = document.getElementById('tabla');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'tabla');
    XLSX.writeFile(book, 'tabla-turnos.xlsx');

  }

}
