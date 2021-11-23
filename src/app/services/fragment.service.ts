import { Location } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperatorFunction, Subscription } from 'rxjs';

interface Partial {
  name: string;
  onMatch?: () => void;
  onMismatch?: () => void;

  /** @desc Disable Immediately Invoked */
  disableII?: boolean;
  // pipeParams?: OperatorFunction<any, any>[];
}

interface SubscriptionStorage {
  [key: string]: {
    onMatchEvents: (() => void)[];
    onMismatchEvents: (() => void)[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class Fragment {
  readonly observable: ActivatedRoute['fragment'];

  private _navigate: Router['navigate'];
  private _subscriptionStorage: SubscriptionStorage = {};

  readonly value: string = '';

  constructor(
    _router: Router,
    _route: ActivatedRoute,
    private _location: Location,
  ) {
    this._navigate = _router.navigate.bind(_router);

    const obs = this.observable = _route.fragment;
    obs.subscribe(this._onChangeFragment.bind(this));
  }

  private _onChangeFragment(fragment: string | null): void {
    const prevFragment = this.value;
    const storage = this._subscriptionStorage;

    if (prevFragment) {
      storage[prevFragment]?.onMismatchEvents.forEach(e => e());
    }

    if (fragment) {
      storage[fragment]?.onMatchEvents.forEach(e => e());
    }

    // @ts-ignore
    this.value = fragment;
  }

  subscribe(partial: Partial): () => void {
    const name = partial.name;
    let subscription = this._subscriptionStorage[name];

    if (!subscription) {
      subscription = this._subscriptionStorage[name] = {
        onMatchEvents: [],
        onMismatchEvents: []
      }
    }

    const onMatch = partial.onMatch;
    if (onMatch) {
      subscription.onMatchEvents.push(onMatch);
      if (!partial.disableII && this.value === name) onMatch();
    }

    const onMismatch = partial.onMismatch;
    if (onMismatch)
      subscription.onMismatchEvents.push(onMismatch);

    return () => {
      if (onMatch) {
        const events = subscription.onMatchEvents;
        events.splice(events.indexOf(onMatch));
      }

      if (onMismatch) {
        const events = subscription.onMismatchEvents;
        events.splice(events.indexOf(onMismatch));
      }
    }
  }

  add(name: string): void {
    this._navigate([], { fragment: name });
  }

  remove(): void {
    if (this.value) {
      this._location.back();
    }
  }

  toggle(name: string): void {
    if (this.value) {
      this._location.back();

    } else {
      this._navigate([], { fragment: name });
    }
  }
}
