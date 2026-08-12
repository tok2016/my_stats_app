'use client';

import FormState, { FormAction } from '@ts/ui/form-state';

import { useRedirectActionForm, useURLSearchParams } from '@lib/hooks';
import {
  getFormDataValue,
  getNumberFormDataValue,
  parseBooleanString
} from '@lib/utils';

import { usePopupState } from '@store/popup-store';

import Button from '@components/Button';
import DoubleSlider from '@components/DoubleSlider';
import HiddenInput from '@components/HiddenInput';
import Input from '@components/Input';
import Popup from '@components/Popup';

import { GamesFilterFormData } from '../types';

const PLAYDATE_DIFF = 5;
const MAX_RATING = 100;

type AdvanceSearchProps = {
  maxHours: number;
  defaultFilters: GamesFilterFormData;
  popupName: string;
};

const formDefaultData = (
  defaultFilters: GamesFilterFormData
): FormState<GamesFilterFormData> => {
  if (defaultFilters) {
    const formData = new FormData();
    Object.entries(defaultFilters).forEach((entry) => {
      formData.set(entry[0], entry[1]);
    });

    return {
      error: false,
      message: '',
      data: formData
    };
  }

  return {
    error: false,
    message: ''
  };
};

const deleteHiddenFields = (
  checkField: keyof GamesFilterFormData,
  fieldsToDelete: (keyof GamesFilterFormData)[],
  updatedData: GamesFilterFormData,
  deletedKeys: string[]
) => {
  if (!parseBooleanString(updatedData[checkField] ?? ''))
    fieldsToDelete.forEach((field) => {
      deletedKeys.push(field);
      delete updatedData[field];
    });
};

export default function AdvanceSearch({
  maxHours,
  defaultFilters,
  popupName
}: AdvanceSearchProps) {
  const { updateParams } = useURLSearchParams();
  const { togglePopup } = usePopupState();

  const searchGames: FormAction<GamesFilterFormData> = (_state, formData) => {
    const data = Object.fromEntries(formData.entries()) as GamesFilterFormData;
    const updatedEntries: GamesFilterFormData = {};
    const deletedKeys: string[] = [];

    Object.entries(data).forEach((entry) => {
      if (!entry[1]) deletedKeys.push(entry[0]);
      else
        updatedEntries[entry[0] as keyof GamesFilterFormData] =
          entry[1].toString();
    });

    deleteHiddenFields(
      'showRating',
      ['ratingFrom', 'ratingTo', 'showRating'],
      updatedEntries,
      deletedKeys
    );
    deleteHiddenFields(
      'showCriticsRating',
      ['criticsRatingFrom', 'criticsRatingTo', 'showCriticsRating'],
      updatedEntries,
      deletedKeys
    );
    deleteHiddenFields(
      'showUsersRating',
      ['usersRatingFrom', 'usersRatingTo', 'showUsersRating'],
      updatedEntries,
      deletedKeys
    );

    updateParams(updatedEntries, deletedKeys);
    togglePopup(popupName);

    return Promise.resolve({
      data: formData,
      error: false,
      message: ''
    });
  };

  const [state, action] = useRedirectActionForm(
    searchGames,
    '',
    formDefaultData(defaultFilters)
  );

  const today = new Date();
  const playdateStart = new Date();
  playdateStart.setFullYear(playdateStart.getFullYear() - PLAYDATE_DIFF);

  const resetParams = () => {
    togglePopup(popupName);
    if (state.data) updateParams({}, state.data.keys().toArray());
  };

  return (
    <Popup name={popupName} variant='light'>
      <h2>Advance search</h2>
      <form
        id='advance-search'
        action={action}
        onReset={resetParams}
        noValidate
      >
        <Input
          id='game-name'
          name='name'
          label='Video game'
          placeholder='Ratchet & Clank'
          defaultValue={getFormDataValue('name', state.data)}
        />

        <Input
          id='game-series'
          name='series'
          label='Series'
          placeholder='Ratchet & Clank'
          defaultValue={getFormDataValue('series', state.data)}
        />

        <Input
          id='game-developer'
          name='developer'
          label='Developer'
          placeholder='Insomniac Games'
          defaultValue={getFormDataValue('developer', state.data)}
        />

        <Input
          id='game-publisher'
          name='publisher'
          label='Publisher'
          placeholder='Sony Interactive Entertainment'
          defaultValue={getFormDataValue('publisher', state.data)}
        />

        <Input
          id='game-genre'
          name='genre'
          label='Genre'
          placeholder='Platform'
          defaultValue={getFormDataValue('genre', state.data)}
        />

        <Input
          id='game-platform'
          name='platform'
          label='Platform'
          placeholder='PlayStation 2'
          defaultValue={getFormDataValue('platform', state.data)}
        />

        <Input
          id='game-release-from'
          name='releaseFrom'
          label='Release date from'
          type='date'
          placeholder={new Date('2000.01.01').toLocaleDateString('en-US')}
          defaultValue={getFormDataValue('releaseFrom', state.data)}
        />

        <Input
          id='game-release-to'
          name='releaseTo'
          label='Release date to'
          type='date'
          placeholder={today.toLocaleDateString('en-US')}
          defaultValue={getFormDataValue('releaseTo', state.data)}
        />

        <Input
          id='game-playdate-from'
          name='playDateFrom'
          type='date'
          label='Play date from'
          placeholder={playdateStart.toLocaleDateString('en-US')}
          defaultValue={getFormDataValue('playDateFrom', state.data)}
        />

        <Input
          id='game-playdate-to'
          name='playDateTo'
          type='date'
          label='Play data to'
          placeholder={today.toLocaleDateString('en-US')}
          defaultValue={getFormDataValue('playDateTo', state.data)}
        />

        <HiddenInput
          id='game-no-rating'
          name='showRating'
          label='Your rating'
          defaultValue={parseBooleanString(
            getFormDataValue('showRating', state.data) ?? ''
          )}
        >
          <DoubleSlider
            leftId='game-rating-from'
            leftName='ratingFrom'
            rightId='game-rating-to'
            rightName='ratingTo'
            min={0}
            max={MAX_RATING}
            defaultValues={[
              getNumberFormDataValue('ratingFrom', state.data) ?? 0,
              getNumberFormDataValue('ratingFrom', state.data) ?? MAX_RATING
            ]}
          />
        </HiddenInput>

        <HiddenInput
          id='game-no-critics-rating'
          name='showCriticsRating'
          label='Critics rating'
          defaultValue={parseBooleanString(
            getFormDataValue('showCriticsRating', state.data) ?? ''
          )}
        >
          <DoubleSlider
            leftId='game-critics-rating-from'
            leftName='criticsRatingFrom'
            rightId='game-critics-rating-to'
            rightName='criticsRatingTo'
            min={0}
            max={MAX_RATING}
            defaultValues={[
              getNumberFormDataValue('criticsRatingFrom', state.data) ?? 0,
              getNumberFormDataValue('criticsRatingTo', state.data)
                ?? MAX_RATING
            ]}
          />
        </HiddenInput>

        <HiddenInput
          id='game-no-users-rating'
          name='showUsersRating'
          label='Users rating'
          defaultValue={parseBooleanString(
            getFormDataValue('showUsersRating', state.data) ?? ''
          )}
        >
          <DoubleSlider
            leftId='game-users-rating-from'
            leftName='usersRatingFrom'
            rightId='game-users-rating-to'
            rightName='usersRatingTo'
            label='Users rating'
            min={0}
            max={MAX_RATING}
            defaultValues={[
              getNumberFormDataValue('usersRatingFrom', state.data) ?? 0,
              getNumberFormDataValue('usersRatingTo', state.data) ?? MAX_RATING
            ]}
          />
        </HiddenInput>

        <DoubleSlider
          leftId='game-hours-from'
          leftName='hoursFrom'
          rightId='game-hours-to'
          rightName='hoursTo'
          label='Hours spent on game'
          min={0}
          max={maxHours}
          defaultValues={[
            getNumberFormDataValue('hoursFrom', state.data) ?? 0,
            getNumberFormDataValue('hoursTo', state.data) ?? maxHours
          ]}
        />

        <Button variant='primary' type='submit'>
          Search
        </Button>

        <Button variant='outlined' type='reset'>
          Cancel
        </Button>
      </form>
    </Popup>
  );
}
