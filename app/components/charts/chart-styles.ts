import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LineElement,
  LineOptions,
  LinearScale,
  PointElement,
  Tooltip
} from 'chart.js';

import { CustomChartType } from '@ts/ui/charts-data';

type ChartClassName = {
  core: string;
  container: string;
};

Chart.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

Chart.defaults.interaction.mode = 'point';
Chart.defaults.backgroundColor = 'transparent';
Chart.defaults.layout.padding = 20;
Chart.defaults.scales = {
  ...Chart.defaults.scales,

  linear: {
    ...Chart.defaults.scales.linear,
    position: 'left',
    border: {
      ...Chart.defaults.scales.linear.border,
      color: '#dee4e6',
      width: 2
    },
    title: {
      ...Chart.defaults.scales.linear.title,
      display: true,
      align: 'end',
      color: '#dee4e6',
      padding: 0,
      font: {
        size: 14,
        weight: 700
      }
    },
    ticks: {
      ...Chart.defaults.scales.linear.ticks,
      align: 'center',
      display: true,
      color: '#dee4e6',
      padding: 12,
      font: {
        size: 12
      },
      callback: (tick) => (!tick || tick === '0' ? undefined : tick.toString())
    },
    grid: {
      ...Chart.defaults.scales.linear.grid,
      drawTicks: true,
      tickColor: '#dee4e6',
      tickWidth: 2,
      tickLength: -8,
      color: '#146086',
      lineWidth: 1
    },
    grace: 1
  },

  category: {
    ...Chart.defaults.scales.category,
    position: 'bottom',
    border: {
      ...Chart.defaults.scales.category.border,
      color: '#dee4e6',
      width: 2
    },
    ticks: {
      ...Chart.defaults.scales.category.ticks,
      align: 'center',
      display: true,
      color: '#dee4e6',
      padding: 2,
      font: {
        size: 12
      }
    },
    title: {
      ...Chart.defaults.scales.category.title,
      display: true,
      align: 'end',
      color: '#dee4e6',
      padding: 0,
      font: {
        size: 14,
        weight: 700
      }
    }
  }
};

Chart.defaults.elements = {
  arc: {
    ...Chart.defaults.elements.arc,
    hoverOffset: 25,
    borderColor: 'transparent',
    borderRadius: 10,
    spacing: 10
  },
  bar: {
    ...Chart.defaults.elements.bar,
    borderRadius: {
      topLeft: 4,
      topRight: 4,
      bottomLeft: 0,
      bottomRight: 0
    }
  },
  point: {
    ...Chart.defaults.elements.point,
    radius: 6,
    backgroundColor: '#2eacc8',
    hoverRadius: 12
  },
  line: {
    ...Chart.defaults.elements.line,
    borderColor: '#2eacc8',
    borderWidth: 3,
    borderCapStyle: 'round',
    spanGaps: true,
    segment: {
      ...(Chart.defaults.elements.line.segment as LineOptions['segment']),
      borderDash: (ctx) => (ctx.p0.skip || ctx.p1.skip ? [6, 10] : undefined)
    }
  }
};

export const ChartClasses: Record<CustomChartType, ChartClassName> = {
  doughnut: {
    core: 'doughnut-chart',
    container: 'doughnut-container'
  },
  periodBar: {
    core: 'period-bar-chart',
    container: 'period-bar-container'
  },
  bar: {
    core: 'bar-chart',
    container: 'bar-container'
  },
  line: {
    core: 'line-chart',
    container: 'line-container'
  },
  map: {
    core: 'map-chart',
    container: 'map-container'
  }
};
