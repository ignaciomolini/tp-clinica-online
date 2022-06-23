import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'historiaClinica'
})
export class HistoriaClinicaPipe implements PipeTransform {

  transform(value: string, ...args: any): string {
    let retorno = '';
    switch (args[0]) {
      case 'altura':
        retorno = `${value} m`
        break;
      case 'peso':
        retorno = `${value} kg`
        break;
      case 'temperatura':
        retorno = `${value} °C`
        break;
      case 'presion':
        retorno = `${value} mmHg`
        break;
    }
    return retorno;
  }

}
