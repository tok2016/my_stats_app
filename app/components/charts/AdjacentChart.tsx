'use client';

type AdjacentChartProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * @param props
 * @param props.children - Charts to place in one flex box.
 * @param props.className
 * @returns Flex group of charts.
 */
export default function AdjacentChart({
  children,
  className = ''
}: AdjacentChartProps) {
  return <div className={`adjacent-chart ${className}`}>{children}</div>;
}
