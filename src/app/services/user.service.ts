import { Inject, Injectable, NgZone } from '@angular/core';
import { ref, remove } from '@firebase/database';
import { deleteUser, User as AuthUser } from 'firebase/auth';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { FIREBASE, Firebase } from './firebase';

type UserState = AuthUser | null | false;

@Injectable({
  providedIn: 'root'
})
export class User {
  state: UserState = false;

  private _changesSubject: BehaviorSubject<UserState>;
  changes: Observable<UserState>;

  constructor(
    private _ngZone: NgZone,
    @Inject(FIREBASE) private _firebase: Firebase
  ) {
    const auth = _firebase.auth;
    auth.onAuthStateChanged(this._onAuthStateChanged.bind(this));

    const subject = this._changesSubject = new BehaviorSubject<any>(false);
    this.changes = subject.pipe(filter(state => state !== false));
  }

  private _onAuthStateChanged(state: AuthUser | null): void {
    this.state = state;
    this._changesSubject.next(state);
  }

  signOut(): void {
    this._ngZone.runOutsideAngular(() => {
      this._firebase.auth.signOut();
      this._ngZone.run(() => {});
    })
  }

  delete(): void {
    const state = this.state;
    if (state) {
      this._ngZone.runOutsideAngular(() => {
        deleteUser(state);
        remove(ref(this._firebase.realtimeDB, 'users/' + state.uid));
        this._ngZone.run(() => {});
      })
    }
  }
}
