import { DOCUMENT } from "@angular/common";
import { Directive, ElementRef, Inject, Input } from "@angular/core";

@Directive({
  selector: '[questionRenderer]'
})
export class QuestionRendererDirective {
  private _contentEl: HTMLElement;

  @Input() set questionRenderer(html: string) {
    const element = this._elementRef.nativeElement;

    const newContentEl = this._document.createElement('div');
    newContentEl.classList.value = 'wq-question-content wq-typography';
    newContentEl.insertAdjacentHTML('beforeend', html);

    const contentEl = this._contentEl;
    contentEl
      ? element.replaceChild(contentEl, newContentEl)
      : element.appendChild(newContentEl);

    this._contentEl = newContentEl;
  }

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private _document: Document
  ) {}
}
