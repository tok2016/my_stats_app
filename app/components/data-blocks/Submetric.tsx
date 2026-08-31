import { MetricWrapperProps, SubmetricId } from '@ts/games/metric';

type SubmetricProps = Omit<MetricWrapperProps, 'id' | 'games'> & {
  id: SubmetricId;
  children: React.ReactNode;
};

const SubmetricTitles: Record<SubmetricId, string> = {
  'genres-count': 'by games count',
  'genres-playtime': 'by playtime',
  'platforms-count': 'by games count',
  'platforms-playtime': 'by playtime'
};

export default function Submetric({
  id,
  renderTitle,
  className,
  children
}: SubmetricProps) {
  return (
    <div id={id} className={`submetric ${className}`}>
      <h4>{renderTitle?.(SubmetricTitles[id]) ?? SubmetricTitles[id]}</h4>
      {children}
    </div>
  );
}
