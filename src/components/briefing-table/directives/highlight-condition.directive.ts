import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHighlightCondition]',
  standalone: true,
})
export class HighlightConditionDirective implements OnChanges {
  @Input() appHighlightCondition = '';

  private readonly pattern = /(BKN|FEW|SCT)(\d{3})/g;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appHighlightCondition']) {
      this.applyHighlight();
    }
  }

  private applyHighlight(): void {
    const matches = this.appHighlightCondition.match(this.pattern);

    if (matches) {
      const coloredText = this.getColoredText(matches);
      this.setInnerHTML(coloredText);
    } else {
      this.setInnerHTML(this.appHighlightCondition);
    }
  }

  private getColoredText(matches: RegExpMatchArray): string {
    let coloredText = this.appHighlightCondition;

    matches.forEach((match) => {
      const number = parseInt(match.slice(3), 10);
      const colorClass = number <= 30 ? 'text-sky-300' : 'text-red-400';
      coloredText = coloredText.replace(match, `<span class="${colorClass}">${match}</span>`);
    });

    return coloredText;
  }

  private setInnerHTML(content: string): void {
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', content);
  }
}
