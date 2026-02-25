'use client';

import { createContext, useMemo, useRef, useState } from 'react';

import {
  ChartContextProps,
  ChartData,
  DisplayFields,
  TooltipData
} from '@ts/ui/charts-data';

import ChartTooltip from '@components/charts/ChartTooltip';

type ChartProviderProps<DataType extends ChartData> = {
  children: React.ReactNode;
  chartId: string;
  displayFields: DisplayFields<DataType>;
  fieldsNames: Record<keyof DataType, string>;
  className?: string;
};

const defaultContext: ChartContextProps = {
  tooltipRef: { current: null },
  updateTooltip: () => {}
};

export const ChartContext = createContext(defaultContext);

export default function ChartProvider<DataType extends ChartData>({
  children,
  chartId,
  displayFields,
  fieldsNames,
  className = ''
}: ChartProviderProps<DataType>) {
  const [tooltipData, setTooltipData] = useState<TooltipData>();
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updateTooltip = (data: ChartData, index?: number, percent?: number) => {
    setTooltipData({ ...data, index, percent });
  };

  const value = useMemo(() => ({ updateTooltip, tooltipRef }), []);

  return (
    <ChartContext.Provider value={value}>
      <div className={`chart ${className}`} id={chartId}>
        <ChartTooltip
          data={tooltipData}
          ref={tooltipRef}
          displayFields={displayFields}
          fieldsNames={fieldsNames}
        />

        {children}
      </div>
    </ChartContext.Provider>
  );
}
