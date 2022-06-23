import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {
  constructor(private router: Router, private toastr: ToastrService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.verificarRol(route);
  }
  
  verificarRol(route: ActivatedRouteSnapshot){
    let usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if(route.data['rol'].includes(usuario.rol)){
      return true;
    }
    this.toastr.error('No tiene los permisos para ingresar aqui', 'Error', {
      timeOut: 3000
    });
    this.router.navigate(['']);
    return false;
  }
}
