import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { RootHeader } from 'src/app/root-header.service';
import { RootView } from 'src/app/root-view.service';
import { Fragment } from 'src/app/services/fragment.service';
import { MediaQuery } from 'src/app/services/media-query.service';
import { WorkbookData } from '../types';

interface List {
  category?: string;
  dataset: (WorkbookData | false)[];
}
interface ExportedList extends List {
  dataset: WorkbookData[];
}

type Suggest = SuggestContent[]; 
interface SuggestContent {
  token: string;
  type: 'history' | 'guess';
}

@Component({
  selector: 'eb-workbook-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wl eb-view eb-view-spacer' }
})
export class WorkbookListComponent implements OnDestroy {
  @ViewChild('rhContent', { static: true })
  set onSetRootHeaderRef(ref: TemplateRef<any>) {
    this._rootHeader.setContent(ref);
  } 

  @ViewChild('searchInputRef')
  searchInputRef: ElementRef<HTMLInputElement>;

  // @ts-expect-error
  lists: ExportedList[] = [
    {
      category: "電工２種",
      dataset: [
        {
          id: 'second-electrician',
          title: '第２種電気工事士',
          shortTitle: '電工２種２０１７',
          desc: '第２種電気工事士の問題',
          tags: ['電工２種'],
          quiz: {},
        },
        {
          id: 'second-electrician',
          title: '第２種電気工事士',
          shortTitle: '電工２種２０１７',
          desc: '第２種電気工事士の問題',
          tags: ['電工２種'],
          quiz: {},
        },
        false,
      ]
    }
  ] as List[];

  suggest: Suggest = [
    {
      token: '第２種電気工事士',
      type: 'history',
    },
    {
      token: '第２種電気工事士',
      type: 'history',
    },
    {
      token: '第２種電気工事士',
      type: 'history',
    },
    {
      token: '第１種電気工事士',
      type: 'guess'
    }
  ];

  private _unobserveFragment: () => void = this._rootHeader.noop;

  constructor(
    rootView: RootView,
    mediaQuery: MediaQuery,
    private _fragment: Fragment,
    private _rootHeader: RootHeader
  ) {
    rootView.loadedRoute['workbook-list'] = true;
    _rootHeader.onClickMobileAction = () => _fragment.add('search');
    _rootHeader.classes = [null, null, 'will-change']; // updateClassは省略

    if (_fragment.streamedValue !== 'search') {
      this._updateHeaderStyleForDefault();
    }

    mediaQuery.pcChanges.subscribe((isPC) => {
      if (isPC) {
        _fragment.remove('search');
        this._unobserveFragment();
        this._unobserveFragment = _rootHeader.noop;

      } else {
        this._unobserveFragment = 
        _fragment.observe({
            name: 'search',
            onMatch: this._updateHeaderStyleForSearch.bind(this),
            onMismatch: this._updateHeaderStyleForDefault.bind(this)
          });
      }
    });
  }

  ngOnDestroy(): void {
    this._unobserveFragment();
  }

  private _updateHeaderStyleForSearch(): void {
    const header = this._rootHeader;
    header.setActionIcon('left', 'back');
    header.onClickLeftAction = () => this._fragment.remove();

    header.setActionIcon('right', 'clear');
    header.onClickRightAction = () => this.searchInputRef.nativeElement.value = '';

    this.searchInputRef?.nativeElement.focus();

    header.setMode('wl-search');
    header.updateClass();
  }

  private _updateHeaderStyleForDefault(): void {
    const header = this._rootHeader;
    header.setActionIcon('left', 'drawer');
    header.onClickLeftAction = () => this._fragment.add('drawer');

    // 仮
    header.setActionIcon('right', 'people');
    header.onClickRightAction = () => this.searchInputRef.nativeElement.value = '';

    this.searchInputRef?.nativeElement.blur();

    header.setMode();
    header.updateClass();
  }

  search(event: Event): void {
    event.preventDefault(); // <= Prevent reload events
  }

  private _onInputSearchbar(): void {
  }

  trackCategory(i: number, list: List) {
    return list.category || i;
  }
  trackId(i: number, data: { id: string }) {
    return data.id;
  }

  rightSuggestActionEvent(type: 'history' | 'guess', event: Event): void {
    if (type === 'guess') {
    }
  }
}
