import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { RootHeader } from 'src/app/root-header.service';
import { Fragment } from 'src/app/services/fragment.service';
import { MediaQuery } from 'src/app/services/media-query.service';
import { WorkbookData } from '../type';

interface List {
  category?: string;
  dataset: (WorkbookData | false)[];
}
interface ExportList extends List {
  dataset: WorkbookData[];
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
  lists: ExportList[] = [
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

  private _unobserveFragment: () => void = this._rootHeader.noop;

  constructor(
    mediaQuery: MediaQuery,
    private _fragment: Fragment,
    private _rootHeader: RootHeader
  ) {
    _rootHeader.onClickMobileActions = () => _fragment.add('search');
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
    header.setActionsIcon('left', 'back');
    header.onClickLeftActions = () => this._fragment.remove();

    header.setActionsIcon('right', 'clear');
    header.onClickRightActions = () => this.searchInputRef.nativeElement.value = '';

    this.searchInputRef?.nativeElement.focus();

    header.setMode('wl-search');
    header.updateClass();
  }

  private _updateHeaderStyleForDefault(): void {
    const header = this._rootHeader;
    header.setActionsIcon('left', 'drawer');
    header.onClickLeftActions = () => this._fragment.add('drawer');

    // 仮
    header.setActionsIcon('right', 'people');
    header.onClickRightActions = () => this.searchInputRef.nativeElement.value = '';

    this.searchInputRef?.nativeElement.blur();

    header.setMode();
    header.updateClass();
  }

  search(event: Event): void {
    event.preventDefault();
  }

  trackCategory(i: number, list: List) {
    return list.category || i;
  }
  trackDataId(i: number, data: WorkbookData) {
    return data.id;
  }
}
