import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  transform(value: number, ...args: any): string {
    let retorno = '';
    switch (args[0]) {
      case 'dia':
        switch (value) {
          case 0:
            retorno = 'Domingo';
            break;
          case 1:
            retorno = 'Lunes';
            break;
          case 2:
            retorno = 'Martes';
            break;
          case 3:
            retorno = 'Miercoles';
            break;
          case 4:
            retorno = 'Jueves';
            break;
          case 5:
            retorno = 'Viernes';
            break;
          case 6:
            retorno = 'Sabado';
            break;
        }
        break;
      case 'hora':
        retorno = `${value}:00`;
        break;
      default:
        retorno = new Date(value).toLocaleString();
    }
    return retorno;
  }

}
