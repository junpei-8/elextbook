import {
  Chart,
  LinearScale,
  CategoryScale,
  LineController,
  PointElement,
  LineElement
} from 'chart.js';

Chart.register(
  LinearScale,
  CategoryScale,
  LineController,
  PointElement,
  LineElement,
);
