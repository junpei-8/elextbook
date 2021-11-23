import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaQuery {
  private _subject: BehaviorSubject<boolean>;
  pcChanges: Observable<boolean>;
  mediaQueryList: MediaQueryList;

  constructor() {
    const mqList = this.mediaQueryList = matchMedia('(min-width: 1024px)');

    mqList.addEventListener
      ? mqList.addEventListener('change', this._onChange.bind(this))
      : mqList.addListener(this._onChange.bind(this));

    const subject = this._subject = new BehaviorSubject(mqList.matches);
    this.pcChanges = subject.asObservable();
  }

  private _onChange(event: MediaQueryListEvent): void {
    this._subject.next(event.matches);
  }
}
