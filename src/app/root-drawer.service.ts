import { ElementRef, Injectable, NgZone } from '@angular/core';
import { RootChangeDetector } from './root-change-detector';
import { RootHeader } from './root-header.service';
import { Fragment } from './services/fragment.service';


@Injectable({
  providedIn: 'root'
})
export class RootDrawer {
  elementRef: ElementRef<HTMLElement>;

  exists: boolean = false;
  private _rootChangeDetector: RootChangeDetector;

  private _closeTimeout?: number;

  private _prevHeaderLeftAction: () => void;
  private _prevHeaderLeftActionSVGKey: string | null;

  constructor(
    private _ngZone: NgZone,
    private _fragment: Fragment,
    private _rootHeader: RootHeader
  ) {
    this._rootChangeDetector = RootChangeDetector;

    _fragment.observe({
      name: 'drawer',
      onMatch: () => this._open(),
      onMismatch: () => this._close()
    });
  }

  open(): void {
    this._fragment.add('drawer');
  }
  toggle(): void {
    this._fragment.toggle('drawer');
  }
  close(): void {
    this._fragment.remove();
  }

  private _open(): void {
    this.exists = true;
    this._rootChangeDetector.ref.markForCheck();

    // const header = this._rootHeader;
    // this._prevHeaderLeftActionsEvent = header.onClickLeftActions;
    // this._prevHeaderLeftActionsSVGKey = header.leftActionsSVGKey;
    // header.setActionsIcon('left', 'clear');
    // header.onClickLeftActions = () => this.close();

    this._ngZone.runOutsideAngular(() => setTimeout(() => {
      const el = this.elementRef.nativeElement;
      el.classList.add('opening');
    }, 16));
  }

  private _close(): void {
    const el = this.elementRef.nativeElement;
    el.classList.remove('opening');

    // const header = this._rootHeader;
    // header.setActionsIcon('left', this._prevHeaderLeftActionsSVGKey as any);
    // header.onClickLeftActions = this._prevHeaderLeftActionsEvent;
    // this._prevHeaderLeftActionsEvent = this._prevHeaderLeftActionsSVGKey = null!;

    clearTimeout(this._closeTimeout);
    this._closeTimeout = setTimeout(() => {
      this.exists = false;
      this._closeTimeout = 0;
      this._rootChangeDetector.ref.markForCheck();
    }, 320) as any;
  }
}
