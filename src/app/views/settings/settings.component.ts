import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { RootHeader } from 'src/app/root-header.service';
import { RootView } from 'src/app/root-view.service';
import { User } from 'src/app/services/user.service';

@Component({
  selector: 'eb-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'st eb-view eb-limit eb-view-spacer' }
})
export class SettingsComponent implements OnInit, OnDestroy {

  userDataChangesSubscription: Subscription;

  hasSignedIn: boolean;

  constructor(
    rootView: RootView,
    rootHeader: RootHeader,
    changeDetector: ChangeDetectorRef,
    public user: User
  ) {
    this.userDataChangesSubscription = user.changes
      .subscribe((state) => {
        rootView.loadedRoute.settings = true;
        this.hasSignedIn = !!state;
        changeDetector.markForCheck();
      });

    rootHeader.setup();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.userDataChangesSubscription.unsubscribe();
  }
}
