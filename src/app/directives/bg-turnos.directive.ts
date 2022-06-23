import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appBgTurnos]'
})
export class BgTurnosDirective {
  @Input() estado: string = ''

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('mouseenter') onMouseEnter() {
    switch (this.estado) {
      case 'pendiente':
        this.highlight('rgba(255, 140, 0, 0.5)');
        break;
      case 'aceptado':
        this.highlight('rgba(60, 255, 0, 0.5)');
        break;
      case 'cancelado':
        this.highlight('rgba(255, 0, 0, 0.5)');
        break;
      case 'rechazado':
        this.highlight('rgba(255, 0, 0, 0.5)');
        break;
      case 'finalizado':
        this.highlight('rgba(0, 130, 255, 0.5)');
        break;
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.elementRef.nativeElement.style.backgroundColor = color;
  }
}
