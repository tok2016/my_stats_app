import { MetricId, MetricWrapperProps } from '@ts/games/metric';

import AddMetricButton from '@components/data-blocks/AddMetricButton';

const MetricTitles: Record<MetricId, string> = {
  'genres-count-playtime': 'Your biggest genres',
  'genres-periods': 'Your most played genres',
  'top-genres-games': 'Your top-5 games by genre',
  'genres-rating': 'Your highest rated genres',
  'recommended-games': 'You might also like',
  'developers-playtime': 'Your favorite developers',
  'publishers-playtime': 'Your favorite publishers',
  'studios-periods': 'Your favorite developer & publisher',
  'developers-rating': 'Your highest rated developers',
  'publishers-rating': 'Your highest rated publishers',
  'developers-countries': 'Your favorite developers around the world'
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
