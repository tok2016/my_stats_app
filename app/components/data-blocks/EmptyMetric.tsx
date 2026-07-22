import { SadGhostSolid } from '@mynaui/icons-react';

type EmptyMetricProps = {
  message: React.ReactNode | string;
  className?: string;
};

export default function EmptyMetric({
  message,
  className = ''
}: EmptyMetricProps) {
  return (
    <div className={`empty-metric ${className}`}>
      <SadGhostSolid />
      {typeof message === 'string' ? <p>{message}</p> : message}
    </div>
  );
}
