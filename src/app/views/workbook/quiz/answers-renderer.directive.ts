import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Input } from '@angular/core';
import { RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import { MlRippleCore } from '@material-lite/angular/core';


@Directive({
  selector: '[answersRenderer]'
})
export class AnswersRendererDirective {  
  private _answerLength?: number;
  private _answerElements: HTMLElement[] = [];

  @Input() set answersRenderer(answers: string[]) {
    const answerLen = this._answerLength;

    answerLen === answers.length
      ? this._updateContent(answers)
      : this._initialize(answers);
  }

  @Input() onClickAnswer: (index: number) => void;

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(RUN_OUTSIDE_NG_ZONE) private _runOutsideNgZone: RunOutsideNgZone
  ) {}

  private _initialize(answers: string[]): void {
    const hostEl = this._elementRef.nativeElement;

    // 子要素をすべて削除
    const currAnswerLen = this._answerLength;
    if (currAnswerLen) {
      const childCount = hostEl.childElementCount;
      for (let i = 0; i < childCount; i++)
        hostEl.removeChild(hostEl.firstChild!);
    }
    this._answerLength = answers.length;

    const docRef = this._document;
    const fragment = docRef.createDocumentFragment();

    const sortedAnswers = sortAnswers(answers);
    const sortedAnswersLen = sortedAnswers.length;
    for (let index = 0; index < sortedAnswersLen; index++) {
      const rowEl = docRef.createElement('div');
      rowEl.classList.value = 'wq-answer-row';

      /**
       * <div class="wq-answer-row">
       *   <div class="wq-answer-overlay"></div>
       *   <div>{{ answers[i] }}</div>
       * </div>
       */
      for (let i = 0; i < 2; i++) {
        const answerHTML = sortedAnswers[index][i];
        if (answerHTML) {
          const answerEl = docRef.createElement('div');
          answerEl.classList.value = 'wq-answer';

          const answerIndex = index + index + i;
          answerEl.addEventListener('click', () => this.onClickAnswer(answerIndex));
  
          const ripple = new MlRippleCore({}, answerEl, this._runOutsideNgZone, docRef.createElement.bind(docRef));
          ripple.setup();
          ripple.addTrigger(answerEl);
    
          const overlayEl = docRef.createElement('div');
          overlayEl.classList.value = 'wq-answer-overlay';
          answerEl.appendChild(overlayEl);
    
          const contentEl = docRef.createElement('div');
          contentEl.classList.value = 'wq-answer-content wq-typography';
          contentEl.insertAdjacentHTML('beforeend', answerHTML);
          answerEl.appendChild(contentEl);
    
          rowEl.appendChild(answerEl);
          this._answerElements.push(answerEl);
        }
      }

      fragment.appendChild(rowEl);
    }

    hostEl.appendChild(fragment);
  }


  private _updateContent(answers: string[]): void {
    const length = this._answerLength!;
    const answerEls = this._answerElements;

    for (let i = 0; i < length; i++) {
      const answerEl = answerEls[i];

      const contentEl = this._document.createElement('div');
      contentEl.classList.value = 'wq-answer-content wq-typography';
      contentEl.insertAdjacentHTML('beforeend', answers[i]);

      answerEl.replaceChild(answerEl.lastChild!, contentEl);
    }
  }
}


type SortedAnswers = [string, string | undefined][];

function sortAnswers(answers: string[]): SortedAnswers {
  const forLen = answers.length + 1;
  const sortedAnswers: SortedAnswers = [];

  for (let i = 1; i < forLen; i = i + 2) {
    const ans = sortedAnswers[(i - 1) * 0.5] = [] as any;
    ans[0] = answers[i - 1];
    ans[1] = answers[i];
  }

  return sortedAnswers;
}
