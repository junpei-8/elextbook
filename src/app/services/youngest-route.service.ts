import { inject, Injectable, InjectionToken } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { RouteData } from '../app-routing.module';
import { RouteChanges, ROUTE_CHANGES } from './route-changes.service';


export interface YoungestRoute {
  ref: ActivatedRoute
}
export const YOUNGEST_ROUTE = new InjectionToken('It youngest route', {
  providedIn: 'root',
  factory: () => {
    const entry: YoungestRoute = {} as any;
    const activatedRoute = inject(ActivatedRoute);

    inject(ROUTE_CHANGES).subscribe(() => {
      let route = activatedRoute;

      while (route.firstChild) {
        route = route.firstChild;
      }

      entry.ref = route;
    });

    return entry;
  }
});
