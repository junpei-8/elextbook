import { inject, InjectionToken } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Observable, Subject } from 'rxjs';

// export const URL_CHANGES = new InjectionToken('It Can detects url changes', {
//   providedIn: 'root',
//   factory: () => inject(Router).events.pipe(
//     filter(event => event instanceof NavigationEnd)
//   )
// });


export type RouteChanges = Observable<string>;
export const ROUTE_CHANGES = new InjectionToken('It Can detects route changes', {
  providedIn: 'root',
  factory: () => {
    const subject = new Subject();
    const router = inject(Router);
    let prevPath: undefined | string;

    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const prev = prevPath;
        const curr = router.url.split(/[#?]/, 1)[0];

        if (prev !== curr) {
          subject.next(event);
          prevPath = curr;
        }
      });

    return subject.asObservable();
  }
});
