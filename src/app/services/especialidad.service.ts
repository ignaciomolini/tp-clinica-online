import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Especialidad } from '../models/especialidad';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  nombreColeccion: string = 'especialidades';

  constructor(private afs: AngularFirestore) { }

  traerTodasLasEspecialidades() {
    return this.afs.collection(this.nombreColeccion).snapshotChanges()
      .pipe(
        map(especialidades => {
          return especialidades.map((especialidad: any) => {
            const data = especialidad.payload.doc.data();
            return { ...data } as Especialidad;
          })
        })
      )
  }

  agregarEspecialidad(especialidad: Especialidad){
    return this.afs.collection(this.nombreColeccion).add(especialidad)
  }
}
