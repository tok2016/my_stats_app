'use client';

import { useRef } from 'react';

import { NewGame } from '@ts/games/game';
import { SearchGame } from '@ts/games/game';
import { Option } from '@ts/ui/components-props';
import { FormAction } from '@ts/ui/form-state';

import AxiosInstanse from '@lib/axios-instanse';
import { useRedirectActionForm, useURLSearchParams } from '@lib/hooks';
import {
  MAX_RATING,
  MINUTES,
  getErrorFormState,
  getFormDataValue,
  getNumberFormDataValue,
  parseBooleanString
} from '@lib/utils';

import Button from '@components/Button';
import CircleSlider from '@components/CircleSlider';
import HiddenInput from '@components/HiddenInput';
import Input from '@components/Input';
import NumberInput from '@components/NumberInput';
import Select from '@components/Select';

import BrowsedGame from './BrowsedGame';

type GameRatingFormProps = {
  game: SearchGame;
};

type GameRatingData = Pick<NewGame, 'platformId' | 'playDate' | 'rating'> & {
  hours: number;
};

const addNewGame =
  (game: SearchGame, controller: AbortController): FormAction<GameRatingData> =>
  async (_state, formData) => {
    const ratingData = Object.fromEntries(formData.entries());
    const newGame: NewGame = {
      apiId: game.apiId,
      name: game.name,
      genresIds: game.genres.map((genre) => genre.id),
      developersIds: game.developers.map((developer) => developer.id),
      publishersIds: game.publishers.map((publisher) => publisher.id),
      cover: game.cover,
      releasedAt: game.releasedAt ? new Date(game.releasedAt) : undefined,
      seriesId: game.series?.id,
      platformId: Number(ratingData.platformId),
      playDate: ratingData.playDate
        ? new Date(ratingData.playDate.toString())
        : undefined,
      minutes: Number(ratingData.hours ?? '') * MINUTES,
      rating: parseBooleanString(ratingData.isRated?.toString() ?? '')
        ? Number(ratingData.rating ?? '')
        : undefined
    };

    try {
      const response = await AxiosInstanse.post('/api/games', newGame, {
        signal: controller.signal
      });

      return {
        error: false,
        message: response.statusText,
        data: formData
      };
    } catch (err) {
      return getErrorFormState(err, formData);
    }
  };

export default function GameRatingForm({ game }: GameRatingFormProps) {
  const { deleteParam } = useURLSearchParams();
  const abortController = useRef(new AbortController());

  const [state, action, isPending] = useRedirectActionForm(
    addNewGame(game, abortController.current),
    '/games/library'
  );

  const onReset = () => {
    deleteParam('gameId');
    abortController.current.abort();
  };

  const platformOptions: Option[] = game.platforms.map((platform) => ({
    value: platform.id.toString(),
    label: platform.name,
    key: `${platform.id}-platform`
  }));

  return (
    <div className='search-game-form card'>
      <h2>Rate this game</h2>
      <BrowsedGame game={game} />

      <form id='game-rating-form' action={action} noValidate>
        <Input
          id='gamePlaydate'
          name='playDate'
          label='Last time you played it'
          type='date'
          defaultValue={getFormDataValue('playDate', state.data)}
          errorHint={state.issues?.playDate}
        />

        <NumberInput
          id='gameHours'
          name='hours'
          label='Hours spent on game'
          placeholder={10}
          min={0}
          max={999999}
          defaultValue={getNumberFormDataValue('hours', state.data)}
          errorHint={state.issues?.hours}
        />

        <Select
          id='gamePlatform'
          name='platformId'
          label='Platforms game was played on'
          variant='plain'
          options={platformOptions}
          placeholder='PC'
          defaultValue={getFormDataValue('platformId', state.data)}
          errorHint={state.issues?.platformId}
        />

        <HiddenInput
          id='is-rated'
          name='isRated'
          label='Your rating'
          defaultValue={true}
        >
          <CircleSlider
            id='gameRating'
            name='rating'
            min={0}
            max={MAX_RATING}
            defaultValue={getNumberFormDataValue('rating', state.data)}
          />
        </HiddenInput>

        <Button type='submit' variant='primary' loading={isPending}>
          Add
        </Button>

        <Button type='reset' variant='outlined' onClick={onReset}>
          Cancel
        </Button>
      </form>

      {state.error && <p className='small error'>{state.message}</p>}
    </div>
  );
}
