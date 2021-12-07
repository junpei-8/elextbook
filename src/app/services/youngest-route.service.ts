import { inject, InjectionToken } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ROUTE_CHANGES } from './route-changes.service';


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
