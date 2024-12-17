import { Directive, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appClickEffect]',
  standalone: true
})
export class ClickEffectDirective {

  constructor(private renderer: Renderer2) { }

  @HostListener('click', ['$event'])
  clickEffect(e: MouseEvent) {
    // Create a new div element for the effect div
    const d = this.renderer.createElement('div');
    this.renderer.addClass(d, 'clickEffect');

    // Position the effect at the click location
    this.renderer.setStyle(d, 'top', `${e.clientY}px`);
    this.renderer.setStyle(d, 'left', `${e.clientX}px`);

    // Add the effect div to the body
    this.renderer.appendChild(document.body, d);

    // Remove the element after the animation ends
    this.renderer.listen(d, 'animationend', () => {
      this.renderer.removeChild(document.body, d);
    });
  }
}
