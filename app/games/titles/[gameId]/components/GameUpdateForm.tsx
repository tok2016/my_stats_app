'use client';

import { useRef } from 'react';

import { GameDetailed, GameUpdate } from '@ts/games/game';
import { Option } from '@ts/ui/components-props';
import { FormAction } from '@ts/ui/form-state';

import AxiosInstanse from '@lib/axios-instanse';
import { useRedirectActionForm } from '@lib/hooks';
import {
  MAX_RATING,
  getErrorFormState,
  getFormDataValue,
  getNumberFormDataValue,
  parseBooleanString
} from '@lib/utils';

import { usePopupState } from '@store/popup-store';

import Button from '@components/Button';
import CircleSlider from '@components/CircleSlider';
import HiddenInput from '@components/HiddenInput';
import Input from '@components/Input';
import NumberInput from '@components/NumberInput';
import Popup from '@components/Popup';
import Select from '@components/Select';

type GameUpdateFormProps = {
  popupName: string;
  game: GameDetailed;
};

const getInputDateString = (date: Date) => {
  const day = date.toLocaleDateString('en-US', { day: '2-digit' });
  const month = date.toLocaleDateString('en-US', { month: '2-digit' });
  const year = date.toLocaleDateString('en-US', { year: 'numeric' });
  return `${year}-${month}-${day}`;
};

const getDefaultData = (game: GameDetailed) => {
  const formData = new FormData();

  formData.set('hours', game.hours.value.toString());
  if (game.playDate)
    formData.set('playDate', getInputDateString(new Date(game.playDate)));
  if (game.platform) formData.set('platformId', game.platform.id.toString());
  if (game.rating) {
    formData.set('isRated', 'on');
    formData.set('rating', game.rating.value.toString());
  }

  return formData;
};

const updateGame =
  (gameId: string, controller: AbortController): FormAction<GameUpdate> =>
  async (_state, formData) => {
    const data = Object.fromEntries(formData.entries());
    const update: GameUpdate = {
      hours: Number(data['hours']),
      rating: parseBooleanString(data['isRated']?.toString() ?? '')
        ? Number(data['rating'])
        : undefined,
      playDate: data['playDate']
        ? new Date(data['playDate'].toString())
        : undefined,
      platformId: Number(data['platformId'])
    };

    try {
      const response = await AxiosInstanse.put(
        `/api/games/titles/item/${gameId}`,
        update,
        { signal: controller.signal }
      );
      return {
        error: false,
        message: response.statusText,
        data: formData
      };
    } catch (err) {
      return getErrorFormState(err, formData);
    }
  };

export default function GameUpdateForm({
  popupName,
  game
}: GameUpdateFormProps) {
  const platformOptions: Option[] = game.platforms.map((platform) => ({
    label: platform.name,
    value: platform.id.toString(),
    key: `${platform.id}-platform`
  }));

  const abortController = useRef(new AbortController());
  const { togglePopup } = usePopupState();

  const [state, action, isPending] = useRedirectActionForm(
    updateGame(game.id, abortController.current),
    '',
    {
      error: false,
      data: getDefaultData(game),
      message: ''
    },
    true
  );

  const onCancel = () => {
    togglePopup(popupName);
    abortController.current.abort();
  };

  const onClose = () => {
    abortController.current.abort();
  };

  return (
    <Popup name={popupName} onClose={onClose}>
      <h2>Update ratings</h2>

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
          defaultValue={parseBooleanString(
            getFormDataValue('isRated', state.data) ?? ''
          )}
        >
          <CircleSlider
            id='gameRating'
            name='rating'
            min={0}
            max={MAX_RATING}
            defaultValue={getNumberFormDataValue('rating', state.data)}
          />
        </HiddenInput>

        <div className='buttons-flex-box'>
          <Button type='submit' variant='primary' loading={isPending}>
            Save
          </Button>

          <Button variant='outlined' onClick={onCancel}>
            Cancel
          </Button>
        </div>

        {state.error && <p className='error'>{state.message}</p>}
      </form>
    </Popup>
  );
}
