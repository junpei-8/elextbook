import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup, TwitterAuthProvider, UserCredential } from '@firebase/auth';

import { Firebase, FIREBASE } from 'src/app/services/firebase';
import { RootHeader } from 'src/app/root-header.service';
import { RootChangeDetector } from 'src/app/root-change-detector';
import { LOADED_ROUTE } from 'src/app/loaded-route';

import { get, ref, update } from '@firebase/database';


@Component({
  selector: 'eb-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'eb-view eb-view-center' }
})
export class SignInComponent implements OnInit {

  constructor(
    rootHeader: RootHeader,
    private _location: Location,
    private _ngZone: NgZone,
    private _changeDetector: ChangeDetectorRef,
    @Inject(FIREBASE) private _firebase: Firebase
  ) {
    LOADED_ROUTE.signIn = true;
    rootHeader.setup();
  }


  ngOnInit(): void {
  }


  signIn(type: 'google' | 'twitter' | 'apple'): void {
    this._ngZone.runOutsideAngular(() => {
      const auth = this._firebase.auth;
  
      const provider = type === 'apple'
        ? new OAuthProvider('apple.com')
        : type === 'google'
          ? new GoogleAuthProvider()
          : new TwitterAuthProvider()
  
      LOADED_ROUTE.signIn = false;
      RootChangeDetector.ref.markForCheck();
  
      signInWithPopup(auth, provider)
        .catch(() => null)
        .then((result) => this._onSignIn(result));
    })
  }

  private _onSignIn(result: UserCredential | null): void {
    if (result === null) {
      LOADED_ROUTE.signIn = true;
      this._ngZone.run(() => this._changeDetector.markForCheck());

    } else {
      const realtimeDBRef = ref(this._firebase.realtimeDB, 'users/' + result.user.uid);

      get(realtimeDBRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            this._onFinalizeSignIn();

          } else {
            update(
              realtimeDBRef,
              {
                'workbookCounter': 100,
                'config': 100
              }
            ).then(() => this._onFinalizeSignIn());
          }
        })
    }
  }

  private _onFinalizeSignIn(): void {
    LOADED_ROUTE.signIn = true;
    this._location.back();
  }
}
