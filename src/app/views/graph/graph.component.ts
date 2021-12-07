import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild, ViewEncapsulation } from '@angular/core';
import { RootHeader } from 'src/app/root-header.service';

import { ChartThemeType, CHART_CONFIG, CHART_LABEL_LENGTH, setChartTheme } from './chart';
import { Chart } from 'chart.js';
import './chart-register';

interface UserData {
  workbook: {
    counter: {
      [category: string]: {
        [date: number]: { // (ex) 5/8 => 508, 10/27 => 1027
          corrected: number;
          mistaken: number;
        }
      }
    }
  }
}

type ChartKey = 'percentage' | 'answered' | keyof UserData['workbook']['counter'][number][number];
type ChartLabel = '正答率' | '回答数' | '正解数' | 'ミス数';

interface ChartData {
  [date: number]: {
    [key in ChartKey]: number;
  }
}

interface ChartPointData {
  value: string | number;
  date: number;
  index: number;
}

interface ChartXGridData {
  date: number;
  index: number;
}

interface Actions {
  key: ChartKey;
  label: ChartLabel;
  theme: string;
}

const BASE_ACTION_BUTTONS: Actions[] = [
  { key: 'percentage', label: '正答率', theme: 'primary' },
  { key: 'corrected',  label: '正解数', theme: 'secondary' },
  { key: 'mistaken',   label: 'ミス数', theme: 'warn' },
  { key: 'answered',   label: '回答数', theme: 'accent' },
];

const USER_DATA: UserData = {
  workbook: {
    counter: (() => {
      const chartDateList = createDateList();
      const entryCounter: UserData['workbook']['counter'] = {
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
}


@Component({
  selector: 'eb-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'gp eb-view eb-limit eb-view-spacer' }
})
export class GraphComponent {
  private _themeType: ChartThemeType = 'light';

  @ViewChild('chartRef') set onSetChartRef(chartRef: ElementRef<any>) {
    this._ngZone.runOutsideAngular(() => {
      const config = CHART_CONFIG;
      const configOptions = config.options!;

      config.data.labels = dateListPipe(this.chartDateList);
      configOptions.onClick = this._onClickChart.bind(this);
      configOptions.onHover = this._onHoverChart.bind(this);

      setChartTheme(config, this._themeType);
      const chart = this.chart = new Chart(chartRef.nativeElement, config);
  
      // @ts-ignore
      this.chartDataset = chart.data.datasets[0];
  
      // DBからUserDataを持ってくる必要がある
      new Promise(resolve => resolve(USER_DATA))
        .then(userData => {
          this.userWorkbookData = (userData as UserData).workbook;
          this.chartData = this.createChartData();
          this.selectChart('percentage');
          this._ngZone.run(() => this._changeDetector.markForCheck());
        })
    })
  }
  chart: Chart;
  chartData: ChartData;
  chartDateList = createDateList();
  readonly chartDataset: Chart['data']['datasets'][number];

  userWorkbookData: UserData['workbook'];

  readonly actionsList: Actions[] = BASE_ACTION_BUTTONS;

  selectedChartKey: string;
  selectedChartPointData: ChartPointData | null;
  selectedChartXGridData: ChartXGridData | null;

  constructor(
    _rootHeader: RootHeader,
    private _ngZone: NgZone,
    private _changeDetector: ChangeDetectorRef
  ) {
    _rootHeader.setup()
  }

  createChartData(filter?: string[]): ChartData {
    const workbookCounter = this.userWorkbookData.counter;
    const chartData: ChartData = {};

    if (!filter) {
      filter = Object.keys(workbookCounter);
    }

    const chartDateList = this.chartDateList;
    filter.forEach((key) => {
      const _counter = workbookCounter[key];

      chartDateList.forEach(date => {
        const chartDataRef =
          chartData[date] ||
          (chartData[date] = { corrected: 0, mistaken: 0 } as ChartData[number]);

        const counter = _counter[date];
        const corrected = counter.corrected + chartDataRef.corrected;
        const mistaken = counter.mistaken + chartDataRef.mistaken;

        const answered = corrected + mistaken;
  
        chartData[date] = {
          corrected, mistaken, answered,
          percentage: Math.round((corrected / answered) * 1000) / 10,
        }
      })
    })

    return chartData;
  }

  selectChart(selectedKey: ChartKey) {
    if (this.selectedChartKey === selectedKey) return;
    this.selectedChartKey = selectedKey;

    this.chartDataset.data = this.chartDateList.map(date => this.chartData[date][selectedKey]);

    const chart = this.chart;
    setChartTheme(chart, this._themeType, {});

    this.selectedChartPointData = null;
    this.selectedChartXGridData = null;

    this._ngZone.runOutsideAngular(() => chart.update('normal'));
  }

  // It's outside the naZone
  private _onClickChart(event: any) {
    const element = this.chart.getElementsAtEventForMode(event, 'index', { axis: 'x' }, true)[0];
    if (element) {
      const index = element.index;
      const date = this.chartDateList[index];

      let pointData: ChartPointData | null = null;
      let selected: number | undefined = void 0;
      let hovered: number | undefined = selected;

      const prevDate = this.selectedChartPointData?.date;
      if (date !== prevDate) {
        const data = this.chartDataset.data;

        pointData = {
          date, index,
          value: data[index] || 'なし' as any
        };

        selected = index;
        hovered = this.selectedChartXGridData?.index;
      }

      const chart = this.chart;
      setChartTheme(chart, this._themeType, { selected, hovered });
      chart.update('normal');

      this._ngZone.run(() => {
        this.selectedChartPointData = pointData;
        this._changeDetector.markForCheck();
      })
    }
  }

  // It's outside the naZone
  private _onHoverChart(event: any) {
    const chart = this.chart;
    const element = chart.getElementsAtEventForMode(event, 'index', { axis: 'x' }, true)[0];

    if (element) {
      const index = element.index;
      const date = this.chartDateList[index];

      const prevXGridData = this.selectedChartXGridData;
      if (prevXGridData && prevXGridData.date === date) return;

      this.selectedChartXGridData = { date, index };

      setChartTheme(this.chart, this._themeType, { selected: this.selectedChartPointData?.index, hovered: index });
      chart.update('normal');
    }
  }

  trackActions(i: number, actions: Actions): string {
    return actions.key;
  }
}

function createDateList(): number[] {
  const date = new Date();

  const month = date.getMonth();
  const day = date.getDate();

  const dateList: number[] = [];
  let lastDayOfLastMonth: undefined | number;

  const length = CHART_LABEL_LENGTH - 1;
  for (let i = length; i >= 0; i--){
    let _month = month;
    let _day = day - i;

    if (_day < 1) {
      if (!lastDayOfLastMonth) {
        lastDayOfLastMonth = new Date(date.getFullYear(), month, 0).getDate();
      }

      _month -= 1;
      _day = lastDayOfLastMonth! + day - i;
    }

    // parseFloat( month{number} + day{string} )
    dateList.push(parseFloat((_month + 1) + ('0' + _day).slice(-2)));
  }

  return dateList;
}

function dateListPipe(dateList: number[]): string[] {
  return dateList.map(date => {
    let strDate = date + '';

    if (strDate.length < 4) {
      strDate = '0' + strDate;
    }

    return `${strDate[0] + strDate[1]}/${strDate[2] + strDate[3]}`;
  })
}
