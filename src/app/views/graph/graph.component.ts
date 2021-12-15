import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RootHeader } from 'src/app/root-header.service';
import { User } from 'src/app/services/user.service';
import { User as AuthUser } from 'firebase/auth';

import { ChartTheme, CHART_CONFIG, ChartDataset } from './chart';
import { Chart, GridLineOptions } from 'chart.js';
import './chart-register';
import { _DeepPartialObject } from 'chart.js/types/utils';
import { RootView } from 'src/app/root-view.service';
import { Subscription } from 'rxjs';
import { Firebase, FIREBASE } from 'src/app/services/firebase';
import { DataSnapshot, onValue, ref } from '@firebase/database';

interface UserDataType {
  workbookCounter: {
    [category: string]: {
      [date: number]: { // (ex) 5/8 => 508, 10/27 => 1027
        corrected: number;
        mistaken: number;
      }
    }
  }
}

type ChartKey = 'percentage' | 'answered' | 'corrected' | 'mistaken';

interface ChartData {
  [date: number]: {
    [key in ChartKey]: number;
  }
}

interface ChartPointData {
  index: number;
  value: string | number;
  date: number;
  displayDate: string;
}

interface ChartXGridData {
  date: number;
  index: number;
}

type ChartScales = {
  [key in 'x' | 'y']: {
    grid: _DeepPartialObject<GridLineOptions>
  }
};

const USER_DATA: UserDataType = {
  workbookCounter: (() => {
    const chartDateList = createDateList();
    const entryCounter: UserDataType['workbookCounter'] = {
      denko2: {},
      otu4: {}
    };

    chartDateList.forEach(date => {
      // @ts-ignore
      entryCounter.denko2[date] = {
        corrected: Math.floor(Math.random() * 100),
        mistaken:  Math.floor(Math.random() * 100),
      };
      // @ts-ignore
      entryCounter.otu4[date] = {
        corrected: Math.floor(Math.random() * 100),
        mistaken:  Math.floor(Math.random() * 100),
      };
    })

    return entryCounter;
  })()
}


@Component({
  selector: 'eb-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'gp eb-view eb-limit eb-view-spacer',
  }
})
export class GraphComponent implements OnDestroy {
  @ViewChild('chartRef') set onSetChartRef(chartRef: ElementRef<any>) {
    if (!chartRef) { return; }

    this._ngZone.runOutsideAngular(() => {
      const config = CHART_CONFIG;
      const configOptions = config.options!;

      config.data.labels = this._chartDateList.map(date => createDisplayDate(date));
      configOptions.onClick = this._onClickChart.bind(this);
      configOptions.onHover = this._onHoverChart.bind(this);

      const canvasEl = chartRef.nativeElement;
      (canvasEl as HTMLElement).addEventListener('mouseleave', this._onMouseoutChart.bind(this));
      (canvasEl as HTMLElement).addEventListener('mouseenter', () => this.hoveredChartXGridIndex = null);

      const chart = this._chart = new Chart(canvasEl, config);
      this._chartDataset = chart.data.datasets[0];

      this._updateChartTheme();

      const dbRef = ref(this._firebase.realtimeDB, 'users/' + (this._user.state as AuthUser).uid + '/workbookCounter');
      this._unsubscribeChartData = onValue(dbRef, (snapshot) => this._onGetCounter(snapshot));
    })
  }
  private _chart: Chart;
  private _chartTheme: ChartTheme = {} as any;
  private _chartData: ChartData;
  private _chartDataset: ChartDataset;
  private get _chartScales(): ChartScales {
    return this._chart.options.scales as any
  }

  private _chartDateList = createDateList(); // [1201, 1202, 1203...]

  private _unsubscribeChartData: (() => void) | undefined;

  selectedChartPointData: ChartPointData | null;
  hoveredChartXGridIndex: number | null = null;

  selectedChart: {
    [key in ChartKey]?: true
  } = {};

  hasSignedIn: boolean;
  private _userChangesSubscription: Subscription;

  constructor(
    rootHeader: RootHeader,
    private _user: User,
    private _rootView: RootView,
    private _ngZone: NgZone,
    private _changeDetector: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(FIREBASE) private _firebase: Firebase
  ) {
    this._userChangesSubscription = _user.changes
      .subscribe((state) => {
        this.hasSignedIn = !!state;
        this._rootView.loadedRoute.graph = !state;

        _changeDetector.markForCheck();
      })

    rootHeader.setup();
  }

  ngOnDestroy(): void {
    this._rootView.loadedRoute.graph = false;
    this._userChangesSubscription.unsubscribe();
    this._unsubscribeChartData?.();
  }

  private _createChartData(counters: UserDataType['workbookCounter'], categories?: string[]): ChartData {
    const chartData: ChartData = {};

    if (!categories) {
      categories = Object.keys(counters);
    }

    const dateList = this._chartDateList;
    const dateListLen = dateList.length;

    const categoryLen = categories.length;
    for (let index = 0; index < categoryLen; index++) {
      const counter = counters[categories[index]];

      for (let i = 0; i < dateListLen; i++) {
        const date = dateList[i];

        const chartDataRef =
          chartData[date] || (chartData[date] = { corrected: 0, mistaken: 0 } as any);

        const count = counter[date];
        const corrected = count.corrected + chartDataRef.corrected;
        const mistaken = count.mistaken + chartDataRef.mistaken;

        const answered = corrected + mistaken;

        chartData[date] = {
          corrected, mistaken, answered,
          percentage: Math.round((corrected / answered) * 1000) / 10,
        }
      }
    }

    return chartData;
  }


  selectChart(key: ChartKey) {
    if (this.selectedChart[key]) return;
    this.selectedChart = {
      [key]: true
    };

    this._chartDataset.data = this._chartDateList.map(date => this._chartData[date][key]);

    this._clearChartColor();
    this.selectedChartPointData = null;
    this.hoveredChartXGridIndex = null;

    this._ngZone.runOutsideAngular(() => this._chart.update('normal'));
  }

  private _onGetCounter(snapshot: DataSnapshot) {
    this._rootView.loadedRoute.graph = true;
    this._chartData = this._createChartData(snapshot.val() || USER_DATA.workbookCounter);
    this.selectChart('percentage'); // <= chart.update() は呼び出される
    this._ngZone.run(() => this._changeDetector.markForCheck());
  }

  private _onClickChart(event: any) {
    const chart = this._chart;
    const element = chart.getElementsAtEventForMode(event, 'index', { axis: 'x' }, true)[0];

    if (element) {
      const index = element.index;
      const date = this._chartDateList[index];

      const prevPointData = this.selectedChartPointData;
      if (!prevPointData || prevPointData.index !== index) {
        this._highlightChartPoint(index);
        this.selectedChartPointData = {
          index, date,
          displayDate: createDisplayDate(date),
          value: this._chartDataset.data[index] || 'なし',
        }
        this._highlightChartGrid(null);

      } else {
        this._clearChartColor();
        this.selectedChartPointData = null;
        // this.hoveredChartXGridIndex = null; <= 消してすぐハイライトしないように、初期化は行わない
      }

      chart.update();
      this._ngZone.run(() => this._changeDetector.markForCheck());
    }
  }

  private _onHoverChart(event: any) {
    const chart = this._chart;
    const element = chart.getElementsAtEventForMode(event, 'index', { axis: 'x' }, true)[0];

    if (element) {
      const index = element.index;

      const prevXGridIndex = this.hoveredChartXGridIndex;
      if (prevXGridIndex === null || prevXGridIndex !== index) {
        this._highlightChartGrid(index);
        this.hoveredChartXGridIndex = index;
        chart.update();
      }
    }
  }

  private _onMouseoutChart() {
    this._highlightChartGrid(null);
    this._chart.update();
  }

  private _updateChartTheme(): void {
    const styleRef = getComputedStyle(this._document.body);
    
    const theme = this._chartTheme = {
      grid: styleRef.getPropertyValue('--ml-fg-divider'),
      hoveredGrid: styleRef.getPropertyValue('--ml-fg-slider-off-active'),
      selectedGrid: styleRef.getPropertyValue('--ml-fg-slider-off'),
      line: styleRef.getPropertyValue('--ml-fg-slider-off'),
      point: styleRef.getPropertyValue('--ml-primary'),
      selectedPoint: styleRef.getPropertyValue('--ml-secondary')
    }

    const scales = this._chartScales;
    scales.y.grid = scales.x.grid = { color: theme.grid };

    this._chartDataset.borderColor = theme.line;
  }

  private _highlightChartPoint(index: number): void {
    const theme = this._chartTheme;
    
    const color = theme.point;
    const colors = [color, color, color, color, color, color, color];

    colors[index] = theme.selectedPoint;

    const dataset = this._chartDataset;
    dataset.pointBorderColor = dataset.pointBackgroundColor = colors;
  }

  private _highlightChartGrid(index: number | null): void {
    const theme = this._chartTheme;

    const colorCode = theme.grid;
    const color = [colorCode, colorCode, colorCode, colorCode, colorCode, colorCode, colorCode];
    const lineWidth = [1, 1, 1, 1, 1, 1, 1];

    const selectedXGrid = this.selectedChartPointData;
    if (selectedXGrid) {
      const i = selectedXGrid.index;
      color[i] = theme.selectedGrid;
      lineWidth[i] = 2;
    }

    if (index !== null) {
      color[index] = theme.hoveredGrid;
      lineWidth[index] = 2;
    }

    this._chartScales.x.grid = { color, lineWidth };
  }

  private _clearChartColor(): void {
    const theme = this._chartTheme;

    const dataset = this._chartDataset;
    dataset.pointBorderColor = dataset.pointBackgroundColor = [theme.point];

    this._chartScales.x.grid = {
      color: theme.grid
    }
  }
}

function createDateList(): number[] {
  const date = new Date();

  const month = date.getMonth();
  const day = date.getDate();

  const dateList: number[] = [];
  let lastDayOfLastMonth: undefined | number;

  for (let i = 6; i >= 0; i--){
    let _month = month;
    let _day = day - i;

    if (_day < 1) {
      if (!lastDayOfLastMonth) {
        lastDayOfLastMonth = new Date(date.getFullYear(), month, 0).getDate();
      }

      _month -= 1;
      _day = lastDayOfLastMonth! + day - i;
    }

    dateList.push(parseFloat((_month + 1) + ('0' + _day).slice(-2)));
  }

  return dateList;
}


function createDisplayDate(date: number): string {
  let strDate = date + '';

  if (strDate.length < 4) {
    strDate = '0' + strDate;
  }

  return `${strDate[0] + strDate[1]}/${strDate[2] + strDate[3]}`;
}
