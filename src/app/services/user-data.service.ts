import { Inject, Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import { FIREBASE, Firebase } from './firebase';

@Injectable({
  providedIn: 'root'
})
export class UserData {
  constructor(
    @Inject(FIREBASE) firebase: Firebase
  ) {
    const auth = firebase.auth;

    auth.onAuthStateChanged(this._onAuthStateChanged.bind(this) as any);
  }

  private _onAuthStateChanged(state: User): void {
  }
}
