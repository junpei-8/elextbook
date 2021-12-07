import { Chart, ChartConfiguration, ChartDataset as _ChartDataset } from 'chart.js';

export type ChartThemeType = 'light' | 'dark';

export type ChartThemeColorKey = 'line' | 'point' | 'selectedPoint' | 'grid' | 'hoveredGrid';
export type ChartThemeSizeKey = 'pointSize' | 'selectedPointSize' | 'gridLineSize' | 'hoveredGridLineSize';

export type ChartTheme = {
  [K in ChartThemeColorKey]: string } & {
  [K in ChartThemeSizeKey]: number
}

export const CHART_LIGHT_THEME: ChartTheme = {
  line: 'rgb(156,39,176,.12)',
  point: '#9C27B0',
  selectedPoint: '#FFEB3B',
  pointSize: 4,
  selectedPointSize: 8,
  grid: 'rgba(0,0,0,.12)',
  hoveredGrid: 'rgba(0,0,0,.32)',
  gridLineSize: 1,
  hoveredGridLineSize: 2
};

export const CHART_DARK_THEME: ChartTheme = {
  line: 'rgb(156,39,176,.12)',
  point: '#9C27B0',
  selectedPoint: '#FFEB3B',
  pointSize: 4,
  selectedPointSize: 8,
  grid: 'rgba(255,255,255,.12)',
  hoveredGrid: 'rgba(0,0,0,.32)',
  gridLineSize: 1,
  hoveredGridLineSize: 2
}

export const CHART_LABEL_LENGTH = 7;

type ChartConfig = ChartConfiguration<'line', any[], string>;
type ChartDataset = _ChartDataset<'line', any[]>;

export const CHART_CONFIG: ChartConfig = {
  type: 'line',
  data: {
    datasets: [
      {
        borderWidth: 2,

        pointBorderWidth: 4,
        pointHitRadius: 4,

        pointHoverBorderWidth: 8,

        animations: {
          borderColor: {
            type: 'color',
            duration: 80,
          },
          borderWidth: {
            number: 'resize',
            duration: 160
          }
        }

      } as any
    ]
  },
  options: {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      y: {
        ticks: {
          callback: (label) => `\u2000\u2000\u2000${label}`.slice(-4),
        }
      },
      x: {} as any,
    },
    maintainAspectRatio: false
  }
}


interface _IndexRef {
  selected?: number,
  hovered?: number
};
export function setChartTheme(chart: Chart | ChartConfig, themeType: ChartThemeType, indexRef?: _IndexRef): void {
  const theme = themeType === 'light'
    ? CHART_LIGHT_THEME
    : CHART_DARK_THEME;

  const dataset = chart.data.datasets[0] as ChartDataset;
  dataset.borderColor = theme.line;
  // dataset.pointBorderColor = dataset.pointBackgroundColor = theme.point;

  const scale = chart.options!.scales!; // @ts-ignore
  scale.y!.grid = scale.x!.grid = { color: theme.grid };
  
  if (indexRef) {
    const pointColor = [];
    const pointSize = [];
    const gridColor = [];
    const gridLineWidth = [];
  
    const labelLength = CHART_LABEL_LENGTH;
    for (let i = 0; i < labelLength; i++) {
      pointColor.push(theme.point);
      pointSize.push(theme.pointSize);
      gridColor.push(theme.grid);
      gridLineWidth.push(theme.gridLineSize);
    }
  
    const selectedIndex = indexRef.selected;
    const hoveredIndex = indexRef.hovered;

    if (selectedIndex || selectedIndex === 0) {
      pointColor[selectedIndex] = theme.selectedPoint;
      pointSize[selectedIndex] = theme.selectedPointSize;
    }
  
    if (hoveredIndex || hoveredIndex === 0) {
      gridColor[hoveredIndex] = theme.hoveredGrid;
      gridLineWidth[hoveredIndex] = theme.hoveredGridLineSize;
    }

    dataset.pointBorderWidth = pointSize;
    dataset.pointBorderColor = dataset.pointBackgroundColor = pointColor;
     // @ts-ignore
    scale.x!.grid = {
      color: gridColor,
      lineWidth: gridLineWidth,
    };
  }
}
