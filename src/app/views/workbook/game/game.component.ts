import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,Inject, NgZone,
  OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation
} from '@angular/core';
import { RootChangeDetector } from 'src/app/root-change-detector';
import { RootHeader } from 'src/app/root-header.service';
import { RootView } from 'src/app/root-view.service';
import { Fragment } from 'src/app/services/fragment.service';
import { MediaQuery } from 'src/app/services/media-query.service';

@Component({
  selector: 'eb-workbook-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wg eb-view' }
})
export class WorkbookGameComponent implements OnInit, OnDestroy {
  @ViewChild('rhContent', { static: true })
  set setRootHeaderContent(content: TemplateRef<any>) {
    this._rootHeader.setContent(content);
  }

  isPlaying: boolean;
  isResults: boolean;

  descHasExpanded: boolean;

  question: string;
  answers: string[] = [];

  private _unobserveFragment: () => void;

  constructor(
    public mediaQuery: MediaQuery,
    public fragment: Fragment,
    private _rootView: RootView,
    private _rootHeader: RootHeader,
    private _changeDetection: ChangeDetectorRef,
    @Inject(DOCUMENT) _document: Document
  ) {
    fragment.remove('playing');

    _rootHeader.setup({
      theme: 'primary',
      onClickMobileAction: () => fragment.add('playing'),
      rightActionIcon: 'starOutline',
      leftActionIcon: 'download',
      willChange: true
    });

    this._unobserveFragment = fragment.observe({
      name: 'playing',
      onMatch: this._play.bind(this),
      onMismatch: this._rest.bind(this)
    });

    setTimeout(() => {
      _rootView.loadedRoute['workbook-game'] = true;
      RootChangeDetector.ref.markForCheck();
    }, 2000);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._unobserveFragment();
    this._rootView.loadedRoute['workbook-game'] = false;
  }

  private _play(): void {
    console.log('playing');

    const header = this._rootHeader;
    header.onClickLeftAction = () => this.fragment.remove();
    header.setActionIcon('left', 'back');
    header.setActionIcon('right', 'more');
    header.setMode('wg-toolbar');
    header.setTheme();
    header.updateClass();

    this._rootView.mobileNavHasHidden = true;

    this.question = '<p class="wgt-p">question</p>';

    this.answers = [
      '<p class="wgt-p">あああああああああああああああああああああああああああああああああああ</p>',
      '<p class="wgt-p">あああああああああああああああああああああああああああああああああああ</p>',
      '<p class="wgt-p">あああああああああああああああああああああああああああああああああああ</p>',
      '<p class="wgt-p">あああああああああああああああああああああああああああああああああああ</p>',
      '<p class="wgt-p">あああああああああああああああああああああああああああああああああああ</p>',
    ];

    this.isPlaying = true;
    this._changeDetection.markForCheck();
  }

  private _rest(): void {
    console.log('resting');

    const header = this._rootHeader;
    header.setActionIcon('left', 'download');
    header.setActionIcon('right', 'starOutline');
    header.setMode();
    header.setTheme('accent');
    header.updateClass();

    this._rootView.mobileNavHasHidden = false;

    this.isPlaying = false;
    this.isResults = true;
    this._changeDetection.markForCheck();
  }

  private _pause(): void {
    // 確認ダイアログを出現させる
    // 確認した後は _rest() を呼び出す
  }

  selectAnswer(index: number): void {
  }
}
