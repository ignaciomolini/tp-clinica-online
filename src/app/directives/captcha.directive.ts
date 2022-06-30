import { Directive, ElementRef, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCaptcha]'
})
export class CaptchaDirective implements OnInit {
  imagenes: any[] = [{ url: '../../../assets/images/captcha/captchaUno.png', clave: 'a5t2i' },
  { url: '../../../assets/images/captcha/captchaDos.png', clave: 'sh8x9' },
  { url: '../../../assets/images/captcha/captchaTres.png', clave: 'o3pd2' },
  { url: '../../../assets/images/captcha/captchaCuatro.png', clave: 'ef45c' },
  { url: '../../../assets/images/captcha/captchaCinco.png', clave: 'zm87e' }]
  captcha: HTMLElement;
  imgHTML = this.renderer.createElement('img');
  inputHTML = this.renderer.createElement('input');
  buttonHTML = this.renderer.createElement('button');
  imagen = this.imagenRandom();
  @Output() respuesta = new EventEmitter<string>()

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { 
    this.captcha = this.elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.crearCaptcha();
  }

  imagenRandom(){
    return this.imagenes[Math.floor(Math.random() * 4)];
  }

  comprobarCaptcha(){
    if(this.imagen.clave == this.inputHTML.value){
      this.renderer.setStyle(this.captcha, 'background-color', 'green');
      setTimeout(() => {
        this.captcha.remove();
        this.respuesta.emit(this.inputHTML.value);
      }, 1000)
    }else{
      this.renderer.setStyle(this.captcha, 'background-color', 'red');
    }
  }

  deshabilitar(){
    setTimeout(() => {
      this.captcha.remove();
      this.respuesta.emit('deshabilitado');
    }, 1000)
  }

  crearCaptcha(){
    /* Seteo el input*/
    this.renderer.addClass(this.inputHTML, 'form-control');
    this.renderer.addClass(this.inputHTML, 'form-control-sm');

    /* Seteo la imagen*/
    this.renderer.setProperty(this.imgHTML, 'src', this.imagen.url);
    this.renderer.setStyle(this.imgHTML, 'height', '4rem');
    
    /* Seteo el boton*/
    this.renderer.appendChild(this.buttonHTML, this.renderer.createText('Deshabilitar'));
    this.renderer.setAttribute(this.buttonHTML, 'type', 'button')
    this.renderer.addClass(this.buttonHTML, 'btn');
    this.renderer.addClass(this.buttonHTML, 'btn-sm');
    this.renderer.addClass(this.buttonHTML, 'btn-secondary');

    /* Seteo el captcha */
    this.renderer.appendChild(this.captcha, this.imgHTML);
    this.renderer.appendChild(this.captcha, this.inputHTML);
    this.renderer.appendChild(this.captcha, this.buttonHTML);
    this.renderer.addClass(this.captcha, 'd-flex');
    this.renderer.addClass(this.captcha, 'flex-column');
    this.renderer.addClass(this.captcha, 'mt-3');
    this.renderer.addClass(this.captcha, 'p-1');
    this.renderer.setStyle(this.captcha, 'background-color', 'grey');
  
    /* Le agrego el evento enter al input */
    this.renderer.listen(this.inputHTML, 'keyup.enter', () => { this.comprobarCaptcha();});

    /* Le agrego el evento click al boton */
    this.renderer.listen(this.buttonHTML, 'click', () => { this.deshabilitar();});
  }
}
