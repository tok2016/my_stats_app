'use client';

import { Chart, ChartType, TooltipModel } from 'chart.js';
import { RefObject } from 'react';

import {
  ChartContextProps,
  ChartData,
  DisplayFields,
  PeriodChartTransformed,
  TooltipData
} from '@ts/ui/charts-data';

import { clamp } from '@lib/utils';

type ChartTooltipProps<DataType extends ChartData> = {
  data?: TooltipData;
  displayFields: DisplayFields<DataType>;
  fieldsNames: Record<keyof DataType, string>;
  ref: RefObject<HTMLDivElement | null>;
  showRank?: boolean;
  colored?: boolean;
};

type TooltipPosition = 'start' | 'center' | 'end';

const SCREEN_MARGIN = 20;

const PositionMult: Record<TooltipPosition, number> = {
  start: 0,
  center: 0.5,
  end: 1
};

export default function ChartTooltip<DataType extends ChartData>({
  data,
  displayFields,
  fieldsNames,
  ref,
  showRank,
  colored
}: ChartTooltipProps<DataType>) {
  const rank = (data?.index ?? -1) + 1;
  return (
    <div
      style={{ opacity: !data ? '0' : undefined }}
      className='tooltip-container'
      data-item={data?.id}
      ref={ref}
    >
      <div
        className='chart-tooltip'
        data-rank={colored ? data?.index : undefined}
      >
        <h3 className='colored'>{data?.name}</h3>

        {displayFields.map((field) => (
          <div key={field.toString()} className='tooltip-key'>
            <span>{fieldsNames[field]}: </span>
            <span className='colored'>{data?.[field] ?? 'no data'}</span>
          </div>
        ))}

        {showRank && rank && (
          <div className='tooltip-badge tooltip-rank'>
            <h3>{rank}</h3>
          </div>
        )}

        {!data?.percent || (
          <div className='tooltip-badge tooltip-percent'>
            <h4>{data?.percent}%</h4>
          </div>
        )}
      </div>
    </div>
  );
}

const hideTooltip = (tooltipRef: RefObject<HTMLDivElement | null>) => {
  if (tooltipRef.current) {
    tooltipRef.current.style.opacity = '0';
    tooltipRef.current.style.top = '0px';
    tooltipRef.current.style.left = '0px';
    tooltipRef.current.style.transition = 'none';
  }
};

const adjustTooltipPosition = <T extends ChartType>(
  tooltipRef: RefObject<HTMLDivElement | null>,
  tooltip: TooltipModel<T>,
  horizontalPos: TooltipPosition,
  verticalPos: TooltipPosition
) => {
  if (tooltipRef.current) {
    const originX =
      tooltip.caretX
      - tooltipRef.current.offsetWidth * PositionMult[horizontalPos];
    const originY =
      tooltip.caretY
      - tooltipRef.current.offsetHeight * PositionMult[verticalPos];

    const { top, left } = tooltip.chart.canvas.getBoundingClientRect();

    const adjustedLeft = clamp(
      originX,
      -left / 2,
      window.innerWidth - tooltipRef.current.offsetWidth - left - SCREEN_MARGIN
    );

    const adjustedTop = clamp(
      originY,
      -top / 2,
      window.innerHeight - tooltipRef.current.offsetHeight - top - SCREEN_MARGIN
    );

    tooltipRef.current.style.left = `${adjustedLeft}px`;
    tooltipRef.current.style.top = `${adjustedTop}px`;

    if (!Number(tooltipRef.current.style.opacity))
      tooltipRef.current.style.opacity = '1';
    else tooltipRef.current.style.transition = 'all 100ms ease';
  }
};

const tooltipTitleToNumber = (title?: string) =>
  Number(title?.toString().replace(/\s/g, '') ?? '0');

export const getTooltip = <DataType extends ChartData>(
  tooltipRef: RefObject<HTMLDivElement | null>,
  updateTooltip: ChartContextProps['updateTooltip'],
  dataMap: Map<number, DataType>,
  horizontalPos: TooltipPosition = 'start',
  verticalPos: TooltipPosition = 'start'
): NonNullable<Chart['options']['plugins']>['tooltip'] => ({
  enabled: false,
  position: 'nearest',
  external: ({ tooltip }) => {
    if (!tooltip.opacity && tooltipRef.current) {
      hideTooltip(tooltipRef);
      return;
    }

    const itemId = tooltipTitleToNumber(tooltip.title?.[0]);
    const data = dataMap.get(itemId);
    const storedId = tooltipRef.current?.dataset['item'];
    adjustTooltipPosition(tooltipRef, tooltip, horizontalPos, verticalPos);

    if (!data || storedId?.toString() === itemId.toString()) return;

    updateTooltip(data);
  }
});

export const getPeriodTooltip = <DataType extends PeriodChartTransformed>(
  tooltipRef: RefObject<HTMLDivElement | null>,
  updateTooltip: ChartContextProps['updateTooltip'],
  dataMap: Map<number, DataType>,
  horizontalPos: TooltipPosition = 'start',
  verticalPos: TooltipPosition = 'start'
): NonNullable<Chart['options']['plugins']>['tooltip'] => ({
  enabled: false,
  position: 'nearest',
  external: ({ tooltip }) => {
    if (!tooltip.opacity && tooltipRef.current) {
      hideTooltip(tooltipRef);
      return;
    }

    const valueKey = tooltip.title[0];
    const itemId = tooltipTitleToNumber(tooltip.dataPoints[0].dataset.label);
    const data = dataMap.get(itemId);
    const storedId = tooltipRef.current?.dataset['item'];
    adjustTooltipPosition(tooltipRef, tooltip, horizontalPos, verticalPos);

    if (!data || storedId?.toString() === itemId.toString()) return;

    updateTooltip({
      ...data,
      value: data.countByPeriod[valueKey] ?? data.value
    });
  }
});
