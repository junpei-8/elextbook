import { Injectable, NgZone } from '@angular/core';

import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore/lite';
import { Database, getDatabase } from 'firebase/database';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { Analytics, getAnalytics } from 'firebase/analytics';
import FIREBASE_CONFIG from './config';

@Injectable({
  providedIn: 'root'
})
export class Firebase {
  private _runOutsideNgZone: NgZone['runOutsideAngular'];

  constructor(
    ngZone: NgZone
  ) {
    this._runOutsideNgZone = ngZone.runOutsideAngular.bind(ngZone);
  }

  get app(): FirebaseApp {
    return this._app || (this._app = initializeApp(FIREBASE_CONFIG));
  }
  private _app?: FirebaseApp;

  get firestore(): Firestore {
    return this._firestore || (this._firestore = getFirestore(this.app));
  }
  private _firestore?: Firestore;

  get realtimeDB(): Database {
    return this._realtimeDB || (this._realtimeDB = getDatabase(this.app));
  }
  private _realtimeDB: Database;

  get storage(): FirebaseStorage {
    return this._storage || (this._storage = getStorage(this.app));
  }
  private _storage?: FirebaseStorage;

  get auth(): Auth {
    return this._auth || (this._auth = this._runOutsideNgZone(() => getAuth(this.app)));
  }
  private _auth?: Auth;

  get analytics(): Analytics {
    return this._analytics || (this._analytics = this._runOutsideNgZone(() => getAnalytics(this.app)));
  }
  private _analytics?: Analytics;
}
