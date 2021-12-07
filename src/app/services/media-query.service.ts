import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaQuery {
  private _pcChangesSubject: BehaviorSubject<boolean>;

  isPC: boolean;
  pcChanges: Observable<boolean>;
  queryList: MediaQueryList;

  constructor() {
    const mqList = this.queryList = window.matchMedia('(min-width: 1024px)');

    mqList.addEventListener
      ? mqList.addEventListener('change', this._onChange.bind(this))
      : mqList.addListener(this._onChange.bind(this));

    const subject = this._pcChangesSubject = new BehaviorSubject(mqList.matches);
    this.pcChanges = subject.asObservable();
  }

  private _onChange(event: MediaQueryListEvent): void {
    const isPC = this.isPC = event.matches;
    this._pcChangesSubject.next(isPC);
  }
}
