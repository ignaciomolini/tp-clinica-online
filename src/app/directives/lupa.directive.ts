import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLupa]'
})
export class LupaDirective {

  constructor(private elementRef: ElementRef, private rederer2: Renderer2) {
  }

  @HostListener('click') onMouseEnter() {
    this.lupa('1.5rem', 'bold');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.lupa('', '');
  }

  private lupa(fs: string, fw: string) {
    const el = this.elementRef.nativeElement;
    this.rederer2.setStyle(el, 'font-size', fs)
    this.rederer2.setStyle(el, 'font-weight', fw)
  }

}
