import { Location } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Observable, Subject } from 'rxjs';

export type RouteChanges = Observable<string>;
export const URL_CHANGES = new InjectionToken('It Can detects url changes', {
  providedIn: 'root',
  factory: () => inject(Router).events.pipe(
    filter(event => event instanceof NavigationEnd)
  )
});


export const ROUTE_CHANGES = new InjectionToken('It Can detects route changes', {
  providedIn: 'root',
  factory: () => {
    const subject = new Subject();
    const location = inject(Location);
    let prevPath: undefined | string;

    inject(URL_CHANGES).subscribe((event) => {
      const prev = prevPath;
      const currPath = location.path();

      if (prev !== currPath) {
        subject.next(event);
        prevPath = currPath;
      }
    });

    return subject.asObservable();
  }
});
