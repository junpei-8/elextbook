import { inject, InjectionToken, NgZone } from '@angular/core';

import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore/lite';
import { Database, getDatabase } from 'firebase/database';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { Analytics, getAnalytics } from 'firebase/analytics';
import FIREBASE_CONFIG from './config';

export interface Firebase {
  get app(): FirebaseApp;
  get firestore(): Firestore;
  get realtimeDB(): Database;
  get storage(): FirebaseStorage;
  get auth(): Auth;
  get analytics(): Analytics;
};
type FirebaseRef = {
  -readonly [K in keyof Firebase]: Firebase[K];
}

export const FIREBASE = new InjectionToken<Firebase>('It Can Firebase Refs', {
  providedIn: 'root',
  factory: () => {
    const ngZone = inject(NgZone);
    const runOutsideNgZone = ngZone.runOutsideAngular.bind(ngZone);
    const ref = {} as FirebaseRef;

    return {
      get app() {
        return ref.app || (ref.app = initializeApp(FIREBASE_CONFIG));
      },
      get firestore(): Firestore {
        return ref.firestore || (ref.firestore = getFirestore(ref.app));
      },
      get realtimeDB(): Database {
        return ref.realtimeDB || (ref.realtimeDB = getDatabase(ref.app));
      },
      get storage(): FirebaseStorage {
        return ref.storage || (ref.storage = getStorage(ref.app));
      },    
      get auth(): Auth {
        return ref.auth || (ref.auth = runOutsideNgZone(() => getAuth(ref.app)));
      },    
      get analytics(): Analytics {
        return ref.analytics || (ref.analytics = runOutsideNgZone(() => getAnalytics(ref.app)));
      }
    }
  }
});
