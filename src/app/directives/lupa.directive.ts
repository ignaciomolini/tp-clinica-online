import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLupa]'
})
export class LupaDirective {

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {
  }

  @HostListener('click') onMouseEnter() {
    this.lupa('1.5rem', 'bold');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.lupa('', '');
  }

  private lupa(fs: string, fw: string) {
    const el = this.elementRef.nativeElement;
    this.renderer2.setStyle(el, 'font-size', fs)
    this.renderer2.setStyle(el, 'font-weight', fw)
  }

}
