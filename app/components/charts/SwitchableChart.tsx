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

/**
 * Switches between given charts. Button shows the icon of the chart that will be rendered on click.
 * @param props
 * @param props.chartsOptions - Inner charts to switch with their icon button.
 * @param props.className
 * @returns Chart that switches given charts on switch button click.
 */
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
        className='switchable-chart__button'
        variant='link'
        icon={chartsOptions[(chartIndex + 1) % chartsOptions.length].icon}
        onClick={switchChart}
      />
    </div>
  );
}
