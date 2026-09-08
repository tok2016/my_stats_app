import { MetricId, SubmetricId } from '@ts/games/metric';

import AddMetricButton from '@components/data-blocks/AddMetricButton';

type MetricWrapperProps<Submetric extends boolean> = {
  id: Submetric extends true ? SubmetricId : MetricId;
  renderTitle?: (title: string) => React.ReactNode;
  children: React.ReactNode;
  className?: string;
  submetric?: Submetric;
};

const MetricTitles: Record<MetricId | SubmetricId, string> = {
  'genres-count-playtime': 'Biggest genres',
  'genres-periods': 'Most played genres',
  'top-genres-games': 'Top-5 games by genre',
  'genres-rating': 'Highest rated genres',
  'recommended-games': 'Might also like',
  'developers-playtime': 'Favorite developers',
  'publishers-playtime': 'Favorite publishers',
  'studios-periods': 'Favorite developer & publisher',
  'developers-rating': 'Highest rated developers',
  'publishers-rating': 'Highest rated publishers',
  'developers-countries': 'Favorite developers around the world',
  'platforms-count-playtime': 'Biggest platforms',
  'platforms-periods': 'Favorite platform',
  'platforms-rating': 'Highest rated platforms',
  'games-playtime': 'Longest played games',
  'games-rating': 'Favorite games',
  'games-periods': 'Longest played games',
  'games-playdate': 'Played games per year',
  'games-release': 'Game releases per year',
  'games-countries': 'Favorite games around the world',
  'top-series': 'Favorite game series',
  'genres-count': 'by games count',
  'genres-playtime': 'by playtime',
  'platforms-count': 'by games count',
  'platforms-playtime': 'by playtime'
};

export default function MetricWrapper<Submetric extends boolean = false>({
  id,
  renderTitle,
  children,
  className = '',
  submetric
}: MetricWrapperProps<Submetric>) {
  const title = renderTitle?.(MetricTitles[id]) ?? MetricTitles[id];

  return (
    <section
      id={id}
      className={`metric ${submetric ? 'submetric' : ''} ${className}`}
    >
      {submetric ? (
        <h4>{title}</h4>
      ) : (
        <div className='metric-title'>
          <h3>{title}</h3>
          <AddMetricButton metricId={id as MetricId} />
        </div>
      )}

      {children}
    </section>
  );
}
