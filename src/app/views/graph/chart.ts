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
        }
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


// interface _IndexRef {
//   selected?: number,
//   hovered?: number
// };
// export function setChartTheme(chart: Chart | ChartConfig, themeType: ChartThemeType, indexRef?: _IndexRef): void {
//   const theme = themeType === 'light'
//     ? CHART_LIGHT_THEME
//     : CHART_DARK_THEME;

//   const dataset = chart.data.datasets[0] as ChartDataset;
//   dataset.borderColor = theme.line;

//   const scale = chart.options!.scales!; // @ts-ignore
//   scale.y!.grid = scale.x!.grid = { color: theme.grid };
  
//   if (indexRef) {
//     const pointColor = [];
//     const gridColor = [];
//     const gridLineWidth = [];
  
//     const labelLength = CHART_LABEL_LENGTH;
//     for (let i = 0; i < labelLength; i++) {
//       pointColor.push(theme.point);
//       gridColor.push(theme.grid);
//       gridLineWidth.push(theme.gridLineSize);
//     }
  
//     const selectedIndex = indexRef.selected;
//     const hoveredIndex = indexRef.hovered;

//     if (selectedIndex || selectedIndex === 0) {
//       pointColor[selectedIndex] = theme.selectedPoint;
//     }
  
//     if (hoveredIndex || hoveredIndex === 0) {
//       gridColor[hoveredIndex] = theme.hoveredGrid;
//       gridLineWidth[hoveredIndex] = theme.hoveredGridLineSize;
//     }

//     dataset.pointBorderColor = dataset.pointBackgroundColor = pointColor;
//      // @ts-ignore
//     scale.x!.grid = {
//       color: gridColor,
//       lineWidth: gridLineWidth,
//     };
//   }
// }
