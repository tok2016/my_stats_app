import { BarElement, Chart, Legend, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { ChartData, PeriodChartData } from '@ts/ui/charts-data';

type PeriodBarChartProps<DataType extends ChartData> = {
  data: PeriodChartData<DataType>;
  className?: string;
};

Chart.register(BarElement, Tooltip, Legend);

export default function PeriodBarChart<DataType extends ChartData>({
  data,
  className
}: PeriodBarChartProps<DataType>) {
  return <div className={`chart ${className}`}></div>;
}
