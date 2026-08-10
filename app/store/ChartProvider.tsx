'use client';

import { createContext, useCallback, useMemo, useRef, useState } from 'react';

import {
  ChartContextProps,
  ChartData,
  DisplayFields,
  FieldsInfo,
  TooltipProps
} from '@ts/ui/charts-data';

import ChartTooltip from '@components/charts/ChartTooltip';

type ChartProviderProps<DataType extends ChartData> = {
  children: React.ReactNode;
  chartId: string;
  displayFields: DisplayFields<DataType>;
  fieldsNames: FieldsInfo<DataType>;
  tooltipProps: TooltipProps;
  className?: string;
};

const defaultContext: ChartContextProps<ChartData> = {
  tooltipRef: { current: null },
  tooltipProps: {
    enableTransition: true
  },
  updateTooltip: () => {}
};

export const ChartContext = createContext(defaultContext);

export default function ChartProvider<DataType extends ChartData>({
  children,
  chartId,
  displayFields,
  fieldsNames,
  tooltipProps,
  className = ''
}: ChartProviderProps<DataType>) {
  const [tooltipData, setTooltipData] = useState<DataType>();
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updateTooltip = useCallback((data: ChartData) => {
    setTooltipData({ ...data } as DataType);
  }, []);

  const value = useMemo(
    () => ({ updateTooltip, tooltipRef, tooltipProps }),
    [updateTooltip, tooltipProps]
  );

  return (
    <ChartContext.Provider value={value}>
      <div className={`chart ${className}`} id={chartId}>
        <ChartTooltip
          data={tooltipData}
          ref={tooltipRef}
          displayFields={displayFields}
          fieldsNames={fieldsNames}
          showRank={tooltipProps?.showRank}
          colored={tooltipProps?.colored}
        />

        {children}
      </div>
    </ChartContext.Provider>
  );
}
