import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    return new Date(value).toLocaleString();
  }

}
