import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { MlPortalContent } from '@material-lite/angular-cdk/portal';
import { Fragment } from './services/fragment.service';
import { User } from './services/user.service';

interface SuggestContent {
  title: string;
  id: string;
  type: 'history' | 'guess';
}

interface SetupConfig {
  content?: MlPortalContent | null;
  mode?: string | null;
  theme?: string | null;
  leftActionIcon?: SVGIconPathKeys;
  rightActionIcon?: SVGIconPathKeys;
  onClickLeftAction?: () => void;
  onClickRightAction?: () => void;
  onClickMobileAction?: () => void;
  willChange?: boolean;
}

type Classes = [(string | null), (string | null), (string | null)];

const noop = () => {};
const SVG_ICON_PATH = {
  back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  more: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
  star: 'M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z',
  clear: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z',
  drawer: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
  people: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6TTcuMDcgMTguMjhjLjQzLS45IDMuMDUtMS43OCA0LjkzLTEuNzhzNC41MS44OCA0LjkzIDEuNzhDMTUuNTcgMTkuMzYgMTMuODYgMjAgMTIgMjBzLTMuNTctLjY0LTQuOTMtMS43MnptMTEuMjktMS40NWMtMS40My0xLjc0LTQuOS0yLjMzLTYuMzYtMi4zM3MtNC45My41OS02LjM2IDIuMzNDNC42MiAxNS40OSA0IDEzLjgyIDQgMTJjMC00LjQxIDMuNTktOCA4LThzOCAzLjU5IDggOGMwIDEuODItLjYyIDMuNDktMS42NCA0Ljgzek0xMiA2Yy0xLjk0IDAtMy41IDEuNTYtMy41IDMuNVMxMC4wNiAxMyAxMiAxM3MzLjUtMS41NiAzLjUtMy41UzEzLjk0IDYgMTIgNnptMCA1Yy0uODMgMC0xLjUtLjY3LTEuNS0xLjVTMTEuMTcgOCAxMiA4czEuNS42NyAxLjUgMS41UzEyLjgzIDExIDEyIDExeiIvPjwvc3ZnPg==',
  download: 'M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z',
  starOutline: 'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z',
};

type SVGIconPathKeys = keyof typeof SVG_ICON_PATH;
type SVGIconDirection = 'left' | 'right';
type SVGContent = SVGPathElement | SVGImageElement;

@Injectable({
  providedIn: 'root'
})
export class RootHeader {
  element: HTMLElement;

  leftActionSVGElement: HTMLElement;
  leftActionSVGKey: SVGIconPathKeys | null;

  rightActionSVGElement: HTMLElement;
  rightActionSVGKey: SVGIconPathKeys | null;

  readonly content: MlPortalContent;
  defaultContent: MlPortalContent;

  classes: Classes = [null, null, null];
  private _classLength = /* this._classes.length */ 3;

  onClickLeftAction: () => void;
  onClickRightAction: () => void;
  onClickMobileAction: () => void;

  noop = noop;


  unsubscribeUserChanges: () => void = this.noop ;


  constructor(
    private _user: User,
    private _ngZone: NgZone,
    private _fragment: Fragment,
    @Inject(DOCUMENT) private _document: Document,
  ) {}

  updateContents(): void {
    this.element = this._document.getElementById('rh')!;
    this.leftActionSVGElement = this._document.getElementById('rh-left-action-svg')!;
    this.rightActionSVGElement = this._document.getElementById('rh-right-action-svg')!;
  }

  setup(config: SetupConfig = {}): void {
    const theme = config.theme;
    const willChange = config.willChange;

    const classes: Classes = [
      config.mode || null,
      theme ? theme + '-theme' : null,
      willChange ? 'will-change' : null
    ];

    this.onClickLeftAction = config.onClickLeftAction || (() => this._fragment.add('drawer'));
    this.onClickRightAction = config.onClickRightAction || noop;
    this.onClickMobileAction = config.onClickMobileAction || noop;

    this.setActionIcon('left', config.leftActionIcon || 'drawer');
    this.setActionIcon('right', config.rightActionIcon || 'people');

    this.setContent(config.content);

    this.classes = classes;
    this.updateClass();
  }

  setContent(content?: MlPortalContent | null): void {
    if (content !== null) { // @ts-ignore
      this.content = content || this.defaultContent;
    }
  }

  updateClass(): void {
    let className = 'rh';
    const classes = this.classes;

    for (let i = 0; i < this._classLength; i++) {
      const name = classes[i];
      if (name) {
        className += ' ' + name;
      } 
    }

    this.element.classList.value = className;
  }

  setMode(name?: string | null): void {
    this.classes[0] = name || null;
  }

  setTheme(theme?: string | null): void {
    this.classes[1] = theme ? theme + '-theme' : null
  }

  enableWillChange(isEnable: boolean) {
    this.classes[2] = isEnable ? 'will-change' : null;
  }


  setActionIcon(direction: SVGIconDirection, key: SVGIconPathKeys): void {
    let svgEl: HTMLElement;

    if (direction === 'left') {
      svgEl = this.leftActionSVGElement;
      if (key === this.leftActionSVGKey) { return; }
      else { this.leftActionSVGKey = key; };

    } else {
      svgEl = this.rightActionSVGElement;
      if (key === this.rightActionSVGKey) { return; }
      else { this.rightActionSVGKey = key; };
    }

    if (key === 'people') {
      const userIconURL = this._user.state?.photoURL;
      svgEl.classList.value = 'rh-people-icon';

      if (userIconURL) {
        const img = this._createSvgImage(userIconURL);
        this._attachSvgContent(svgEl, img, direction);
        this.unsubscribeUserChanges();
        this.unsubscribeUserChanges = noop;


      } else {
        const peoplePath = SVG_ICON_PATH.people;
        const img = this._createSvgImage('data:image/svg+xml;base64,' + peoplePath);
        this._attachSvgContent(svgEl, img, direction);

        const subscription = this._user.changes
          .subscribe((state) => {
            const url = state?.photoURL;
            if (url) {
              const img = this._createSvgImage(url);
              this._attachSvgContent(svgEl, img, direction);

            } else {
              const img = this._createSvgImage('data:image/svg+xml;base64,' + peoplePath);
              this._attachSvgContent(svgEl, img, direction);
            }
          })

        this.unsubscribeUserChanges();
        this.unsubscribeUserChanges = () => subscription.unsubscribe();
      }


    } else {
      const el = this._document.createElementNS('http://www.w3.org/2000/svg', 'path') as any;
      svgEl.classList.value = '';

      el.setAttribute('d', SVG_ICON_PATH[key]);
      this._attachSvgContent(svgEl, el, direction);
      this.unsubscribeUserChanges();
      this.unsubscribeUserChanges = noop;
    }
  }


  private _attachSvgContent(svgElement: HTMLElement, content: SVGContent, direction: SVGIconDirection): void {
    const leavePathEl = svgElement.lastChild as HTMLElement;
    if (leavePathEl)
      leavePathEl.classList.value = 'rh-' + direction + '-icon-path';

    const enterPathClassList = content.classList;
    enterPathClassList.add('rh-' + direction + '-icon-path');
    svgElement.appendChild(content);

    this._ngZone.runOutsideAngular(() =>
      setTimeout(() => enterPathClassList.add('rh-visible-' + direction + '-icon-path'), 16));

    this._ngZone.runOutsideAngular(() =>
      setTimeout(() => { if (leavePathEl) leavePathEl.remove(); }, 280));
  }


  private _createSvgImage(url: string): SVGImageElement {
    const el = this._document.createElementNS('http://www.w3.org/2000/svg', 'image');
    el.setAttribute('href', url);
    el.classList.value = 'rh-icon';

    return el;
  }
}
