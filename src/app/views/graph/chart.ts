import { ChartConfiguration, ChartDataset as _ChartDataset } from 'chart.js';

export type ChartThemeColorKey = 'line' | 'point' | 'selectedPoint' | 'grid' | 'hoveredGrid' | 'selectedGrid';
export type ChartThemeSizeKey = 'pointSize' | /* 'selectedPointSize' | */ 'gridLineSize' | 'hoveredGridLineSize';

export type ChartTheme = {
  [K in ChartThemeColorKey]: string
}

type ChartConfig = ChartConfiguration<'line', any[], string>;
export type ChartDataset = _ChartDataset<'line', any[]>;

export const CHART_CONFIG: ChartConfig = {
  type: 'line',
  data: {
    datasets: [
      {
        data: null!,

        borderWidth: 2,
        pointBorderWidth: 6,
        pointHoverBorderWidth: 8,

        animations: {
          borderColor: {
            type: 'color',
            duration: 160,
          }
        },

        animation: false
      }
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
          callback: (label) => `\u2000${label}`
        },
        suggestedMax: 100
      },
      x: {} as any,
    },
    maintainAspectRatio: false
  }
}
