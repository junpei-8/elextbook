
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subscription } from 'rxjs';
import { LOADED_ROUTE } from 'src/app/loaded-route';
import { RootHeader } from 'src/app/root-header.service';
import { User } from 'src/app/services/user.service';


@Component({
  selector: 'eb-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'st eb-view eb-limit eb-view-spacer' }
})
export class SettingsComponent implements OnDestroy {

  userChangesSubscription: Subscription;

  hasSignedIn: boolean;


  constructor(
    ngZone: NgZone,
    rootHeader: RootHeader,
    changeDetector: ChangeDetectorRef,
    public user: User,
  ) {
    this.userChangesSubscription = user.changes
      .subscribe((state) => {
        LOADED_ROUTE.settings = true;
        this.hasSignedIn = !!state;

        ngZone.run(() => changeDetector.markForCheck());
      });

    rootHeader.setup();
  }


  ngOnDestroy(): void {
    this.userChangesSubscription.unsubscribe();
  }
}
