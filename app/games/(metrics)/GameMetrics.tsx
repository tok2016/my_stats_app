import { GameMetricId, MetricContentProps } from '@ts/games/metric';

import PeriodTopsSkeletons from '@components/data-blocks/PeriodTopsSkeletons';

import GenreTops from './genres/metrics/GenreTops';
import GenresCountPlaytime from './genres/metrics/GenresCountPlaytime';
import GenresPeriodTops from './genres/metrics/GenresPeriodTops';
import HighestRatedGenres from './genres/metrics/GenresRatings';
import GamesRatings from './genres/metrics/GenresRatings';
import RecommendedGames from './genres/metrics/RecommendedGames';
import GenreTopsSkeleton from './genres/skeletons/GenreTopsSkeleton';
import GenresCountPlaytimeSkeleton from './genres/skeletons/GenresCountPlaytimeSkeleton';
import GenresRatingsSkeleton from './genres/skeletons/GenresRatingsSkeleton';
import RecommendedGamesSkeletons from './genres/skeletons/RecommendedGamesSkeletons';
import PlatformsCountPlaytime from './platforms/metrics/PlatformsCountPlaytime';
import PlatformsPeriodTops from './platforms/metrics/PlatformsPertiodTops';
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
import SeriesCount from './titles/metrics/SeriesCount';
import GameYearsSkeleton from './titles/skeletons/GameYearsSkeleton';
import GamesCountriesSkeleton from './titles/skeletons/GamesCountriesSkeleton';
import GamesPlaytimeSkeleton from './titles/skeletons/GamesPlaytimeSkeleton';
import GamesRatingsSkeleton from './titles/skeletons/GamesRatingsSkeleton';
import SeriesCountSkeleton from './titles/skeletons/SeriesCountSkeleton';

type MetricFunc = (props: MetricContentProps) => React.ReactNode;

export const GameMetrics: Record<GameMetricId, MetricFunc> = {
  'genres-count-playtime': (props) => <GenresCountPlaytime {...props} />,
  'genres-periods': (props) => <GenresPeriodTops {...props} />,
  'top-genres-games': (props) => <GenreTops {...props} />,
  'genres-rating': (props) => <HighestRatedGenres {...props} />,
  'recommended-games': (props) => <RecommendedGames {...props} />,
  'developers-playtime': (props) => (
    <StudiosCountPlaytime {...props} type='developer' />
  ),
  'publishers-playtime': (props) => (
    <StudiosCountPlaytime {...props} type='publisher' />
  ),
  'studios-periods': (props) => <StudiosPeriodTops {...props} />,
  'developers-rating': (props) => (
    <StudiosRatings {...props} type='developer' />
  ),
  'publishers-rating': (props) => (
    <StudiosRatings {...props} type='publisher' />
  ),
  'developers-countries': (props) => <StudiosCountries {...props} />,
  'platforms-count-playtime': (props) => <PlatformsCountPlaytime {...props} />,
  'platforms-periods': (props) => <PlatformsPeriodTops {...props} />,
  'platforms-rating': (props) => <PlatformsRatings {...props} />,
  'games-playtime': (props) => <GamesPlaytime {...props} />,
  'games-rating': (props) => <GamesRatings {...props} />,
  'games-periods': (props) => <GamesPeriodTops {...props} />,
  'games-playdate': (props) => <GamePlayDates {...props} />,
  'games-release': (props) => <GameReleases {...props} />,
  'games-countries': (props) => <GamesCountries {...props} />,
  'top-series': (props) => <SeriesCount {...props} />
};

export const GameMetricsSkeletons: Record<GameMetricId, React.ReactNode> = {
  'genres-count-playtime': <GenresCountPlaytimeSkeleton />,
  'genres-periods': <PeriodTopsSkeletons metricId='genres-periods' />,
  'top-genres-games': <GenreTopsSkeleton />,
  'genres-rating': <GenresRatingsSkeleton />,
  'recommended-games': <RecommendedGamesSkeletons />,
  'developers-playtime': (
    <StudiosCountPlaytimeSkeleton metricId='developers-playtime' />
  ),
  'publishers-playtime': (
    <StudiosCountPlaytimeSkeleton metricId='publishers-playtime' />
  ),
  'studios-periods': <PeriodTopsSkeletons metricId='studios-periods' />,
  'developers-rating': <StudiosRatingsSkeleton metricId='developers-rating' />,
  'publishers-rating': <StudiosRatingsSkeleton metricId='publishers-rating' />,
  'developers-countries': <StudiosCountriesSkeleton />,
  'platforms-count-playtime': <PlatformsCountPlaytimeSkeleton />,
  'platforms-periods': <PeriodTopsSkeletons metricId='platforms-periods' />,
  'platforms-rating': <PlatformsRatingsSkeleton />,
  'games-playtime': <GamesPlaytimeSkeleton />,
  'games-rating': <GamesRatingsSkeleton />,
  'games-periods': <PeriodTopsSkeletons metricId='games-periods' />,
  'games-playdate': <GameYearsSkeleton metricId='games-playdate' />,
  'games-release': <GameYearsSkeleton metricId='games-release' />,
  'games-countries': <GamesCountriesSkeleton />,
  'top-series': <SeriesCountSkeleton />
};
