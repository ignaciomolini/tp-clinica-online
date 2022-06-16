import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Turno } from '../models/turno';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  nombreColeccion: string = 'turnos';

  constructor(private afs: AngularFirestore) { }

  traerTodosLosTurnos() {
    return this.afs.collection(this.nombreColeccion).snapshotChanges()
      .pipe(
        map(turnos => {
          return turnos.map((turno: any) => {
            const data = turno.payload.doc.data();
            return { idDb: turno.payload.doc.id , ...data };
          })
        })
      )
  }

  agregarTurno(turno: Turno){
    return this.afs.collection(this.nombreColeccion).add(turno);
  }
}
