import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Partial {
  name: string;
  onMatch?: () => void;
  onMismatch?: () => void;

  /** @desc Disable Immediately Invoked */
  disableII?: boolean;
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

  readonly streamedValue: string | null = null;

  get value(): string | null {
    return this._route.snapshot.fragment;
  }

  constructor(
    router: Router,
    private _route: ActivatedRoute,
    private _location: Location,
  ) {
    this._navigate = router.navigate.bind(router);

    const obs = this.observable = _route.fragment;
    obs.subscribe(this._onChangeFragment.bind(this));
  }


  private _onChangeFragment(fragment: string | null): void {
    const prevFragment = this.streamedValue;
    const storage = this._subscriptionStorage;

    if (prevFragment) {
      storage[prevFragment]?.onMismatchEvents.forEach(e => e());
    }

    if (fragment) {
      storage[fragment]?.onMatchEvents.forEach(e => e());
    }

    // @ts-ignore
    this.streamedValue = fragment;
  }


  observe(partial: Partial): () => void {
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

    return unobserveFragment.bind(null, subscription, onMatch, onMismatch);
  }


  add(name: string): void {
    this._navigate([], {
      fragment: name,
      queryParams: this._route.snapshot.queryParams
    });
  }


  remove(name?: string): void {
    const value = this.value;
    if (value) {
      if (!name || name === value) {
        this._location.back();
      }
    }
  }


  toggle(name: string): void {
    if (this.value) {
      this._location.back();

    } else {
      this._navigate([], {  
        fragment: name,
        queryParams: this._route.snapshot.queryParams
      });
    }
  }
}

type Subscription = SubscriptionStorage[number];
function unobserveFragment(subscription: Subscription, onMatch?: () => void, onMismatch?: () => void): void {
  if (onMatch) {
    const events = subscription.onMatchEvents;
    events.splice(events.indexOf(onMatch));
  }

  if (onMismatch) {
    const events = subscription.onMismatchEvents;
    events.splice(events.indexOf(onMismatch));
  }
}
