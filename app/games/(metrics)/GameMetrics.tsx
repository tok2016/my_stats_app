import { GameMetricId, MetricContentProps } from '@ts/games/metric';

import MetricWrapper from '@components/data-blocks/MetricWrapper';
import PeriodTopsSkeletons from '@components/data-blocks/PeriodTopsSkeletons';

import GenreTops from './genres/metrics/GenreTops';
import GenresCountPlaytime from './genres/metrics/GenresCountPlaytime';
import GenresPeriodTops from './genres/metrics/GenresPeriodTops';
import HighestRatedGenres from './genres/metrics/GenresRatings';
import RecommendedGames from './genres/metrics/RecommendedGames';
import GenreTopsSkeleton from './genres/skeletons/GenreTopsSkeleton';
import GenresCountPlaytimeSkeleton from './genres/skeletons/GenresCountPlaytimeSkeleton';
import GenresRatingsSkeleton from './genres/skeletons/GenresRatingsSkeleton';
import RecommendedGamesSkeletons from './genres/skeletons/RecommendedGamesSkeletons';

type MetricFunc = (props: MetricContentProps) => React.ReactNode;

export const GameMetrics: Record<GameMetricId, MetricFunc> = {
  'genres-count-playtime': (props) => <GenresCountPlaytime {...props} />,
  'genres-periods': (props) => <GenresPeriodTops {...props} />,
  'top-genres-games': (props) => <GenreTops {...props} />,
  'genres-rating': (props) => <HighestRatedGenres {...props} />,
  'recommended-games': (props) => <RecommendedGames {...props} />
};

export const GameMetricsSkeletons: Record<GameMetricId, React.ReactNode> = {
  'genres-count-playtime': <GenresCountPlaytimeSkeleton />,
  'genres-periods': <PeriodTopsSkeletons metricId='genres-periods' />,
  'top-genres-games': <GenreTopsSkeleton />,
  'genres-rating': <GenresRatingsSkeleton />,
  'recommended-games': <RecommendedGamesSkeletons />
};
