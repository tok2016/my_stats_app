import { GameMetricId, MetricContentProps } from '@ts/games/metric';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import PeriodTopsSkeletons from '@components/data-blocks/PeriodTopsSkeletons';

import GenreTops, { GenreTopsSkeleton } from '../genres/metrics/GenreTops';
import GenresCountPlaytime from '../genres/metrics/GenresCountPlaytime';
import GenresPeriodTops from '../genres/metrics/GenresPeriodTops';
import GenresRatings, {
  GenresRatingsSkeleton
} from '../genres/metrics/GenresRatings';
import RecommendedGames, {
  RecommendedGamesSkeleton
} from '../genres/metrics/RecommendedGames';
import GenresCountPlaytimeSkeleton from '../genres/skeletons/GenresCountPlaytimeSkeleton';
import PlatformsCountPlaytime from '../platforms/metrics/PlatformsCountPlaytime';
import PlatformsPeriodTops from '../platforms/metrics/PlatformsPeriodTops';
import PlatformsRatings, {
  PlatformsRatingsSkeleton
} from '../platforms/metrics/PlatformsRatings';
import PlatformsCountPlaytimeSkeleton from '../platforms/skeletons/PlatformsCountPlaytimeSkeleton';
import StudiosCountPlaytime, {
  StudiosCountPlaytimeSkeleton
} from '../studios/metrics/StudiosCountPlaytime';
import StudiosCountries from '../studios/metrics/StudiosCountries';
import StudiosPeriodTops from '../studios/metrics/StudiosPeriodTops';
import StudiosRatings, {
  StudiosRatingsSkeleton
} from '../studios/metrics/StudiosRatings';
import GamePlayDates from '../titles/metrics/GamePlayDates';
import GameReleases from '../titles/metrics/GameReleases';
import GamesCountries from '../titles/metrics/GamesCountries';
import GamesPeriodTops from '../titles/metrics/GamesPeriodTops';
import GamesPlaytime, {
  GamesPlaytimeSkeleton
} from '../titles/metrics/GamesPlaytime';
import GamesRatings, {
  GamesRatingsSkeleton
} from '../titles/metrics/GamesRatings';
import SeriesCount, {
  SeriesCountSkeleton
} from '../titles/metrics/SeriesCount';

type MetricFunc = (props: MetricContentProps) => React.ReactNode;

export const GameMetrics: Record<GameMetricId, MetricFunc> = {
  'genres-count-playtime': (props) => (
    <GenresCountPlaytime {...props} key={props.metricId} />
  ),
  'genres-periods': (props) => (
    <GenresPeriodTops {...props} key={props.metricId} />
  ),
  'top-genres-games': (props) => <GenreTops {...props} key={props.metricId} />,
  'genres-rating': (props) => <GenresRatings {...props} key={props.metricId} />,
  'recommended-games': (props) => (
    <RecommendedGames {...props} key={props.metricId} />
  ),
  'developers-playtime': (props) => (
    <StudiosCountPlaytime {...props} type='developer' key={props.metricId} />
  ),
  'publishers-playtime': (props) => (
    <StudiosCountPlaytime {...props} type='publisher' key={props.metricId} />
  ),
  'studios-periods': (props) => (
    <StudiosPeriodTops {...props} key={props.metricId} />
  ),
  'developers-rating': (props) => (
    <StudiosRatings {...props} type='developer' key={props.metricId} />
  ),
  'publishers-rating': (props) => (
    <StudiosRatings {...props} type='publisher' key={props.metricId} />
  ),
  'developers-countries': (props) => (
    <StudiosCountries {...props} key={props.metricId} />
  ),
  'platforms-count-playtime': (props) => (
    <PlatformsCountPlaytime {...props} key={props.metricId} />
  ),
  'platforms-periods': (props) => (
    <PlatformsPeriodTops {...props} key={props.metricId} />
  ),
  'platforms-rating': (props) => (
    <PlatformsRatings {...props} key={props.metricId} />
  ),
  'games-playtime': (props) => (
    <GamesPlaytime {...props} key={props.metricId} />
  ),
  'games-rating': (props) => <GamesRatings {...props} key={props.metricId} />,
  'games-periods': (props) => (
    <GamesPeriodTops {...props} key={props.metricId} />
  ),
  'games-playdate': (props) => (
    <GamePlayDates {...props} key={props.metricId} />
  ),
  'games-release': (props) => <GameReleases {...props} key={props.metricId} />,
  'games-countries': (props) => (
    <GamesCountries {...props} key={props.metricId} />
  ),
  'top-series': (props) => <SeriesCount {...props} key={props.metricId} />
};

export const GameMetricsSkeletons: Record<GameMetricId, React.ReactNode> = {
  'genres-count-playtime': (
    <GenresCountPlaytimeSkeleton key='genres-count-playtime' />
  ),
  'genres-periods': (
    <PeriodTopsSkeletons
      metricId='genres-periods'
      key='genres-periods'
      showBar
    />
  ),
  'top-genres-games': <GenreTopsSkeleton key='top-genres-games' />,
  'genres-rating': <GenresRatingsSkeleton key='genres-rating' />,
  'recommended-games': <RecommendedGamesSkeleton key='recommended-games' />,
  'developers-playtime': (
    <StudiosCountPlaytimeSkeleton key='developers-playtime' />
  ),
  'publishers-playtime': (
    <StudiosCountPlaytimeSkeleton key='publishers-playtime' />
  ),
  'studios-periods': (
    <PeriodTopsSkeletons metricId='studios-periods' key='studios-periods' />
  ),
  'developers-rating': <StudiosRatingsSkeleton key='developers-rating' />,
  'publishers-rating': <StudiosRatingsSkeleton key='publishers-rating' />,
  'developers-countries': (
    <ChartSkeleton type='map' key='developers-countries' />
  ),
  'platforms-count-playtime': (
    <PlatformsCountPlaytimeSkeleton key='platforms-count-playtime' />
  ),
  'platforms-periods': (
    <PeriodTopsSkeletons
      metricId='platforms-periods'
      key='platforms-periods'
      showBar
    />
  ),
  'platforms-rating': <PlatformsRatingsSkeleton key='platforms-rating' />,
  'games-playtime': <GamesPlaytimeSkeleton key='games-playtime' />,
  'games-rating': <GamesRatingsSkeleton key='games-rating' />,
  'games-periods': (
    <PeriodTopsSkeletons metricId='games-periods' key='games-periods' />
  ),
  'games-playdate': <ChartSkeleton type='line' key='games-playdate' />,
  'games-release': <ChartSkeleton type='line' key='games-release' />,
  'games-countries': <ChartSkeleton type='map' key='games-countries' />,
  'top-series': <SeriesCountSkeleton key='top-series' />
};
