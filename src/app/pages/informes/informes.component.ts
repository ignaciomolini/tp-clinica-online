import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { TurnoService } from 'src/app/services/turno.service';
import { Turno } from 'src/app/models/turno';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { Especialidad } from 'src/app/models/especialidad';
import { Observable, Subject } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Especialista } from 'src/app/models/especialista';
import * as XLSX from 'xlsx';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css'],
  animations: [
    trigger('entrada', [
      state('void', style({
        transform: 'translateX(0%)',
        opacity: 0
      })),
      transition(':enter', [
        animate("1.5s ease-in")
      ])
    ])
  ]
})
export class InformesComponent implements OnInit {
  logs: any;
  datosGrafico = new Subject();

  constructor(private logService: LogService, private turnoService: TurnoService, private especialidadService: EspecialidadService, private usuarioService: UsuarioService) {
  }

  ngOnInit(): void {
    this.logService.traerTodasLosLogs().subscribe(logs => {
      this.logs = logs;
    })
    this.especialidadService.traerTodasLasEspecialidades().subscribe((especialidades: Especialidad[]) => {
      this.turnoService.traerTodosLosTurnos().subscribe((turnos: Turno[]) => {
        this.usuarioService.traerTodosLosUsuariosEspecialista().subscribe((especialistas: Especialista[]) => {
          this.datosGrafico.next({ turnos: turnos, especialidades: especialidades, especialistas: especialistas });
        })
      })
    })
  }

  getDatosGrafico(): Observable<any> {
    return this.datosGrafico.asObservable();
  }

  exportarAExcel() {
    let element = document.getElementById('tabla');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'tabla');
    XLSX.writeFile(book, 'tabla-logs-usuarios.xlsx');
  }

}
