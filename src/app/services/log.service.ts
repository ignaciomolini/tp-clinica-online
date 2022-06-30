import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  nombreColeccion: string = 'logs';

  constructor(private afs: AngularFirestore) { }

  traerTodasLosLogs() {
    return this.afs.collection(this.nombreColeccion).valueChanges();
  }

  agregarLog(log: any){
    return this.afs.collection(this.nombreColeccion).add(log);
  }
}
