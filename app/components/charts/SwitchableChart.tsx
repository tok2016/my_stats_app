'use client';

import { type ReactNode, useReducer } from 'react';

import IconButton from '@components/IconButton';

type SwitchableChartProps = {
  chartsOptions: {
    chart: ReactNode;
    icon: ReactNode;
  }[];
  className?: string;
};

export default function SwitchableChart({
  chartsOptions,
  className = ''
}: SwitchableChartProps) {
  const [chartIndex, switchChart] = useReducer(
    (prevIndex) =>
      !chartsOptions.length ? 0 : (prevIndex + 1) % chartsOptions.length,
    0
  );

  if (!chartsOptions.length) return;

  return (
    <div className={`switchable-chart ${className}`}>
      {chartsOptions[chartIndex].chart}
      <IconButton
        className='switch-button'
        variant='link'
        icon={chartsOptions[(chartIndex + 1) % chartsOptions.length].icon}
        onClick={switchChart}
      />
    </div>
  );
}
