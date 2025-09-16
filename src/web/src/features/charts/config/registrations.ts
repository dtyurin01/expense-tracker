import {
  Chart,
  LineController,
  BarController,
  DoughnutController,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  LinearScale,
  CategoryScale,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

export function registerChartComponents() {
  Chart.register(
    LineController,
    BarController,
    DoughnutController,
    LineElement,
    BarElement,
    ArcElement,
    PointElement,
    LinearScale,
    CategoryScale,
    RadialLinearScale,
    Filler,
    Tooltip,
    Legend
  );
}
