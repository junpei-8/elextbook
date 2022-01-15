import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { listen } from '@material-lite/angular-cdk/utils';
import { LOADED_ROUTE } from 'src/app/loaded-route';
import { RootHeader } from 'src/app/root-header.service';
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
  isHistory?: boolean;
}

const SUGGEST = [
  {
    token: '第２種電気工事士',
    isHistory: true
  },
  {
    token: '第２種電気工事士',
  },
  {
    token: '第２種電気工事士',
    isHistory: true
  },
  {
    token: '第１種電気工事士',
  }
];

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

  private _searchInput: HTMLInputElement | null;
  @ViewChild('rhSearchInputRef')
  set onSetSearchInputRef(ref: ElementRef<HTMLInputElement>) {
    let searchInput = this._searchInput;

    if (ref && !searchInput) {
      searchInput = this._searchInput = ref.nativeElement;
      const fragment = this._fragment;

      if (fragment.value !== 'search') {
        this._updateHeaderStyleForDefault();
      }
  
      this._mediaQuery.pcChanges.subscribe((isPC) => {
        if (isPC) {
          this._removeStyleHandler();
          this._removeStyleHandler = this._observeInputFocus();

          fragment.remove('search');
          this._updateHeaderStyleForDefault();

        } else {
          this._removeStyleHandler = 
            fragment.observe({
              name: 'search',
              onMatch: () => {
                this._updateHeaderStyleForSearch();
                this.renderSuggest();
              },
              onMismatch: () => {
                this._updateHeaderStyleForDefault();
                this.deleteSuggest();
              }
            });
        }
      });

      this._activatedRoute.queryParams.subscribe((params: { query?: string }) => {
        const query = params.query;
  
        if (query && searchInput) {
          searchInput.value = query;
        }
      });
    }
  }


  searchInputHasFocused: boolean;


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


  // TODO: DBから取得する
  suggest: Suggest;


  private _deletingSuggestTimeoutId: number = 0;
  private _removeStyleHandler: () => void = () => {};


  constructor(
    private _router: Router,
    private _fragment: Fragment,
    private _rootHeader: RootHeader,
    private _mediaQuery: MediaQuery,
    private _activatedRoute: ActivatedRoute,
    private _changeDetector: ChangeDetectorRef
  ) {
    LOADED_ROUTE.workbookList = true;
    _rootHeader.onClickMobileAction = () => _fragment.add('search');
    _rootHeader.classes = [null, null, 'will-change']; // updateClassは省略
  }


  ngOnDestroy(): void {
    // this._unobserveFragment?.();
    this._removeStyleHandler();
  }


  private _observeInputFocus(): () => void {
    const searchInput = this._searchInput!;

    const _listen = listen;

    const removeFocusListener =
      _listen(searchInput, 'focus', () => {
        this.renderSuggest();
        this.searchInputHasFocused = true;
        this._changeDetector.markForCheck();
      });

    const removeBlurListener =
      _listen(searchInput, 'blur', () => {
        this.deleteSuggest();
        this.searchInputHasFocused = false;
        this._changeDetector.markForCheck();
      });

    return () => {
      removeFocusListener();
      removeBlurListener();
    };
  }


  private _updateHeaderStyleForSearch(): void {
    this._searchInput?.focus();

    const header = this._rootHeader;

    header.setMode('wl-search');

    header.setActionIcon('left', 'back');
    header.onClickLeftAction = () => this._fragment.remove();

    header.setActionIcon('right', 'clear');
    header.onClickRightAction = () => this._searchInput!.value = '';

    header.updateClass();
  }


  private _updateHeaderStyleForDefault(): void {
    this._searchInput?.blur();

    const header = this._rootHeader;

    header.setMode();

    header.setActionIcon('left', 'drawer');
    header.onClickLeftAction = () => this._fragment.add('drawer');

    // 仮
    header.setActionIcon('right', 'people');
    header.onClickRightAction = () => this._searchInput!.value = '';
  
    header.updateClass();
  }


  search(event: Event): void {
    event.preventDefault(); // <= Prevent reload events

    const query = this._searchInput!.value;

    const extras = query
      ? { queryParams: { query } }
      : void 0;

    this._router.navigate([], extras);
  }


  onInputSearchbar(): void {
    // const value = this._searchInput!.value;
  }


  trackCategory(i: number, list: List) {
    return list.category || i;
  }
  trackId(i: number, data: { id: string }) {
    return data.id;
  }


  rightSuggestActionEvent(content: SuggestContent): false {
    if (content.isHistory) {


    } else {
      this._searchInput!.value = content.token;
    }

    return false;
  }


  renderSuggest(): void {
    // TODO: DBから取得する
    this.suggest = SUGGEST;
  }


  deleteSuggest(): void {
    const duration = this._mediaQuery.isPC ? 120 : 240;

    this._deletingSuggestTimeoutId =
      setTimeout(() => {
        clearTimeout(this._deletingSuggestTimeoutId);
        this.suggest = [];
        this._changeDetector.markForCheck();
      }, duration) as any;
  }
}
