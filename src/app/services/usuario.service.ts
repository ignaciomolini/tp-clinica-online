import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import { Administrador } from '../models/administrador';
import { Especialista } from '../models/especialista';
import { Paciente } from '../models/paciente';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  nombreColeccion: string = 'usuarios';

  constructor(private afs: AngularFirestore, private storage: Storage) { }

  traerTodosLosUsuarios() {
    return this.afs.collection(this.nombreColeccion).snapshotChanges()
      .pipe(
        map(usuarios => {
          return usuarios.map((usuario: any) => {
            const data = usuario.payload.doc.data();
            return { idDb: usuario.payload.doc.id ,...data };
          })
        })
      )
  }

  agregarUsuario(usuario: Paciente | Especialista | Administrador){
    return this.afs.collection(this.nombreColeccion).add(usuario)
  }

  modificarEstadoActivo(id:string, valor: boolean){
    return this.afs.collection(this.nombreColeccion).doc(id).update({activo: valor});
  }

  async subirImagen(imagen: Blob, ruta: string){
    const imgRef = ref(this.storage, ruta);
    const resp = await uploadBytes(imgRef, imagen)
    return getDownloadURL(resp.ref);
  }

  
}
