import { Chart } from 'chart.js';

export const yBarLineAxis = (
  title: string
): NonNullable<Chart<'bar' | 'line'>['options']['scales']>[string] => ({
  type: 'linear',
  position: 'left',
  border: {
    color: '#dee4e6',
    width: 2
  },
  title: {
    display: true,
    text: title,
    align: 'end',
    color: '#dee4e6',
    padding: 10,
    font: {
      size: 14,
      weight: 700
    }
  },
  ticks: {
    mirror: true,
    align: 'center',
    display: true,
    color: '#dee4e6',
    backdropColor: '#050709',
    textStrokeWidth: 2,
    textStrokeColor: '#050709',
    padding: -2,
    showLabelBackdrop: true,
    z: 5,
    font: {
      size: 12
    },
    backdropPadding: 5
  },
  grid: {
    drawTicks: false,
    color: '#146086',
    lineWidth: 1
  }
});

export const xBarAxis = (
  title: string,
  labels: string[]
): NonNullable<Chart<'bar'>['options']['scales']>[string] => ({
  type: 'category',
  position: 'bottom',
  labels,
  border: {
    color: '#dee4e6',
    width: 2
  },
  ticks: {
    align: 'center',
    display: true,
    color: '#dee4e6',
    padding: 2,
    font: {
      size: 12
    }
  },
  title: {
    display: true,
    text: title,
    align: 'end',
    color: '#dee4e6',
    padding: 0,
    font: {
      size: 14,
      weight: 700
    }
  }
});

export const barElements: Chart<'bar'>['options']['elements'] = {
  arc: {
    hoverOffset: 25,
    borderColor: 'transparent',
    borderRadius: 10,
    spacing: 10
  },
  bar: {
    borderRadius: {
      topLeft: 4,
      topRight: 4
    }
  }
};

export const arcElements: Chart<'doughnut'>['options']['elements'] = {
  arc: {
    hoverOffset: 25,
    borderColor: 'transparent',
    borderRadius: 10,
    spacing: 10
  }
};
