import { MetricId, MetricWrapperProps } from '@ts/games/metric';

import AddMetricButton from '@components/data-blocks/AddMetricButton';

const MetricTitles: Record<MetricId, string> = {
  'genres-count-playtime': 'Your biggest genres',
  'genres-periods': 'Your most played genres',
  'top-genres-games': 'Your top-5 games by genre',
  'genres-rating': 'Your highest rated genres',
  'recommended-games': 'You might also like'
};

export default function MetricWrapper({
  id,
  renderTitle,
  children,
  className = ''
}: MetricWrapperProps) {
  return (
    <section id={id} className={`metric ${className}`}>
      <div className='metric-title'>
        <h3>{renderTitle?.(MetricTitles[id]) ?? MetricTitles[id]}</h3>
        <AddMetricButton metricId={id as MetricId} />
      </div>

      {children}
    </section>
  );
}
