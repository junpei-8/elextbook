import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[insertContent]'
})
export class InsertContentDirective {
  private _element: HTMLElement;

  @Input() set insertContent(html: string) {
    const element = this._element;

    if (element.childElementCount > 1) {
      element.lastChild!.remove();
    }
    element.insertAdjacentHTML('beforeend', html);
  }

  constructor(elementRef: ElementRef) {
    this._element = elementRef.nativeElement;
  }
}
