import { inject, InjectionToken, Type } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Data,
  NavigationEnd,
  Router
  } from '@angular/router';
import { filter, Observable, Subject } from 'rxjs';

// export const URL_CHANGES = new InjectionToken('It Can detects url changes', {
//   providedIn: 'root',
//   factory: () => inject(Router).events.pipe(
//     filter(event => event instanceof NavigationEnd)
//   )
// });

type _ActivatedRoute<D = Data> = ActivatedRoute & {
  data: Observable<D>;
  snapshot: ActivatedRouteSnapshot & {
    data: D
  };
}

type Component = Type<any> | string | null;

export type RouteChanges<D = Data> = Observable<_ActivatedRoute<D>>;
export const ROUTE_CHANGES = new InjectionToken('It Can detects route changes', {
  providedIn: 'root',
  factory: () => {
    const subject = new Subject<ActivatedRoute>();
    const router = inject(Router);

    let prevLastComponent: Component;

    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let lastComponent: Component;

        let route = router.routerState.root;
        let routeChild: any = route;

        while ((routeChild = routeChild.firstChild)) {
          route = routeChild;
        }

        lastComponent = route.component;

        if (lastComponent !== prevLastComponent) {
          subject.next(route);
          prevLastComponent = lastComponent;
        }
      });

    return subject.asObservable();
  }
});
