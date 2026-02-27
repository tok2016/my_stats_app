'use client';

type UnitedChartProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AdjacentChart({
  children,
  className = ''
}: UnitedChartProps) {
  return <div className={`adjacent-chart ${className}`}>{children}</div>;
}
