import { Location } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Observable } from 'rxjs';

export type RouteChanges = Observable<string>;
// export const ROUTE_CHANGES = new InjectionToken('It Can detects route changes', {
//   providedIn: 'root',
//   factory: () => {
//     const location = inject(Location);

//     return new Observable(observer => {
//       location.onUrlChange(() => {
//         let prevPath: string | undefined;

//         const currPath = location.path();
//         if (prevPath !== currPath) {
//           observer.next(currPath);
//           prevPath = currPath;
//         }
//       })
//     });
//   }
// });
export const ROUTE_CHANGES = new InjectionToken('It Can detects route changes', {
    providedIn: 'root',
    factory: () => {
      const location = inject(Location);
      const route = inject(Router);
  
      // return new Observable(observer => {
      //   location.onUrlChange(() => {
      //     let prevPath: string | undefined;
  
      //     const currPath = location.path();
      //     if (prevPath !== currPath) {
      //       observer.next(currPath);
      //       prevPath = currPath;
      //     }
      //   })
      // });
      return route.events.pipe(filter(event => event instanceof NavigationEnd))
    }
  });
  