import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) { }

  async login(email: string, password: string) {
    try {
      return await this.auth.signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      let mensaje;
      switch (error.code) {
        case "auth/internal-error":
          mensaje = "Error interno."
          break;
        case "auth/user-not-found":
          mensaje = "El email no corresponde al de un usuario."
          break;
        case "auth/invalid-email":
          mensaje = "Mal formato de email."
          break;
        case "auth/wrong-password":
          mensaje = "La contraseña no es correcta."
          break;
        default:
          mensaje = "Error"
          break;
      }
      throw new Error(mensaje);
    }
  }

  async register(email: string, password: string) {
    try{
      return await this.auth.createUserWithEmailAndPassword(email, password);  
    } catch (error: any) {
      let mensaje;
      switch (error.code) {
        case "auth/email-already-in-use":
          mensaje = "El email ya se encuentra registrado."
          break;
        case "auth/internal-error":
          mensaje = "Error interno."
          break;
        case "auth/invalid-email":
          mensaje = "Mal formato de email."
          break;
        case "auth/weak-password":
          mensaje = "Contraseña muy corta. Por lo menos debe tener 6 caracteres."
          break;
        default:
          mensaje = "Error"
          break;
      }
      throw new Error(mensaje);
    }  
  }

  async sendVerificationEmail(): Promise<any> {
    return (await this.auth.currentUser)?.sendEmailVerification();
  }

  logout() {
    return this.auth.signOut()
  }

  getCurrentUser() {
    return this.auth.authState;
  }
}
