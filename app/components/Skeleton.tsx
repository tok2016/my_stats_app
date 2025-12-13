import { ImageSolid, ChartColumnBigSolid } from '@mynaui/icons-react';

type SkeletonProps = {
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'text' | 'image' | 'graph';
  fontSize?: 'min' | 'small' | 'regular' | 'large';
  lineHeight?: 'tight' | 'fit' | 'wide';
  width?: string;
  height?: string;
  rows?: number;
  className?: string;
};

export default function Skeleton({
  type = 'text',
  fontSize = 'regular',
  lineHeight = 'fit',
  className,
  width,
  height,
  rows = 1
}: SkeletonProps) {
  return (
    <div className={`skeletons ${className}`} style={{ width }}>
      {Array.from({ length: rows }, (_v, i) => (
        <div
          key={i}
          className={`skeleton ${type} ${fontSize} ${lineHeight}`}
          style={{ height }}
        >
          {type !== 'image' || <ImageSolid />}
          {type !== 'graph' || <ChartColumnBigSolid />}
        </div>
      ))}
    </div>
  );
}
