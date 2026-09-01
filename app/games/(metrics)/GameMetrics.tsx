import { GameMetricId, MetricContentProps } from '@ts/games/metric';

import PeriodTopsSkeletons from '@components/data-blocks/PeriodTopsSkeletons';

import GenreTops from './genres/metrics/GenreTops';
import GenresCountPlaytime from './genres/metrics/GenresCountPlaytime';
import GenresPeriodTops from './genres/metrics/GenresPeriodTops';
import GenresRatings from './genres/metrics/GenresRatings';
import RecommendedGames from './genres/metrics/RecommendedGames';
import GenreTopsSkeleton from './genres/skeletons/GenreTopsSkeleton';
import GenresCountPlaytimeSkeleton from './genres/skeletons/GenresCountPlaytimeSkeleton';
import GenresRatingsSkeleton from './genres/skeletons/GenresRatingsSkeleton';
import RecommendedGamesSkeletons from './genres/skeletons/RecommendedGamesSkeletons';
import PlatformsCountPlaytime from './platforms/metrics/PlatformsCountPlaytime';
import PlatformsPeriodTops from './platforms/metrics/PlatformsPeriodTops';
import PlatformsRatings from './platforms/metrics/PlatformsRatings';
import PlatformsCountPlaytimeSkeleton from './platforms/skeletons/PlatformsCountPlaytimeSkeleton';
import PlatformsRatingsSkeleton from './platforms/skeletons/PlatformsRatingsSkeleton';
import StudiosCountPlaytime from './studios/metrics/StudiosCountPlaytime';
import StudiosCountries from './studios/metrics/StudiosCountries';
import StudiosPeriodTops from './studios/metrics/StudiosPeriodTops';
import StudiosRatings from './studios/metrics/StudiosRatings';
import StudiosCountPlaytimeSkeleton from './studios/skeletons/StudiosCountSkeleton';
import StudiosCountriesSkeleton from './studios/skeletons/StudiosCountriesSkeleton';
import StudiosRatingsSkeleton from './studios/skeletons/StudiosRatingsSkeleton';
import GamePlayDates from './titles/metrics/GamePlayDates';
import GameReleases from './titles/metrics/GameReleases';
import GamesCountries from './titles/metrics/GamesCountries';
import GamesPeriodTops from './titles/metrics/GamesPeriodTops';
import GamesPlaytime from './titles/metrics/GamesPlaytime';
import GamesRatings from './titles/metrics/GamesRatings';
import SeriesCount from './titles/metrics/SeriesCount';
import GameYearsSkeleton from './titles/skeletons/GameYearsSkeleton';
import GamesCountriesSkeleton from './titles/skeletons/GamesCountriesSkeleton';
import GamesPlaytimeSkeleton from './titles/skeletons/GamesPlaytimeSkeleton';
import GamesRatingsSkeleton from './titles/skeletons/GamesRatingsSkeleton';
import SeriesCountSkeleton from './titles/skeletons/SeriesCountSkeleton';

type MetricFunc = (props: MetricContentProps) => React.ReactNode;

export const GameMetrics: Record<GameMetricId, MetricFunc> = {
  'genres-count-playtime': (props) => <GenresCountPlaytime {...props} />,
  'genres-periods': (props) => (
    <GenresPeriodTops {...props} games={props.games.toArray()} />
  ),
  'top-genres-games': (props) => (
    <GenreTops {...props} games={props.games.toArray()} />
  ),
  'genres-rating': (props) => <GenresRatings {...props} />,
  'recommended-games': (props) => <RecommendedGames {...props} />,
  'developers-playtime': (props) => (
    <StudiosCountPlaytime {...props} type='developer' />
  ),
  'publishers-playtime': (props) => (
    <StudiosCountPlaytime {...props} type='publisher' />
  ),
  'studios-periods': (props) => (
    <StudiosPeriodTops {...props} games={props.games.toArray()} />
  ),
  'developers-rating': (props) => (
    <StudiosRatings {...props} type='developer' />
  ),
  'publishers-rating': (props) => (
    <StudiosRatings {...props} type='publisher' />
  ),
  'developers-countries': (props) => <StudiosCountries {...props} />,
  'platforms-count-playtime': (props) => <PlatformsCountPlaytime {...props} />,
  'platforms-periods': (props) => (
    <PlatformsPeriodTops {...props} games={props.games.toArray()} />
  ),
  'platforms-rating': (props) => <PlatformsRatings {...props} />,
  'games-playtime': (props) => <GamesPlaytime {...props} />,
  'games-rating': (props) => <GamesRatings {...props} />,
  'games-periods': (props) => (
    <GamesPeriodTops {...props} games={props.games.toArray()} />
  ),
  'games-playdate': (props) => <GamePlayDates {...props} />,
  'games-release': (props) => <GameReleases {...props} />,
  'games-countries': (props) => <GamesCountries {...props} />,
  'top-series': (props) => <SeriesCount {...props} />
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
  'recommended-games': <RecommendedGamesSkeletons key='recommended-games' />,
  'developers-playtime': (
    <StudiosCountPlaytimeSkeleton
      metricId='developers-playtime'
      key='developers-playtime'
    />
  ),
  'publishers-playtime': (
    <StudiosCountPlaytimeSkeleton
      metricId='publishers-playtime'
      key='publishers-playtime'
    />
  ),
  'studios-periods': (
    <PeriodTopsSkeletons metricId='studios-periods' key='studios-periods' />
  ),
  'developers-rating': (
    <StudiosRatingsSkeleton
      metricId='developers-rating'
      key='developers-rating'
    />
  ),
  'publishers-rating': (
    <StudiosRatingsSkeleton
      metricId='publishers-rating'
      key='publishers-rating'
    />
  ),
  'developers-countries': (
    <StudiosCountriesSkeleton key='developers-countries' />
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
  'games-playdate': (
    <GameYearsSkeleton metricId='games-playdate' key='games-playdate' />
  ),
  'games-release': (
    <GameYearsSkeleton metricId='games-release' key='games-release' />
  ),
  'games-countries': <GamesCountriesSkeleton key='games-countries' />,
  'top-series': <SeriesCountSkeleton key='top-series' />
};
