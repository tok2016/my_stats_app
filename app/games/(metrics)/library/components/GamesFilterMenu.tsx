'use client';

import { GamesFilter } from '@ts/games/filter';

import { useURLSearchParams } from '@lib/hooks';

import { usePopupState } from '@store/popup-store';

import Button from '@components/Button';
import Search from '@components/Search';

import { GamesFilterFormData } from '../types';
import { NonFormFilterFields } from '../utils';
import AdvanceSearch from './AdvanceSearch';

type GamesFilterMenuProps = {
  maxHours: number;
  filters: GamesFilter;
};

const ADVANCE_SEARCH_POPUP = 'advance-search-menu';

const removeNonFormFields = (filters: GamesFilter): GamesFilterFormData => {
  const formFilters = { ...filters };
  NonFormFilterFields.forEach((field) => {
    delete formFilters[field];
  });

  return formFilters;
};

export default function GamesFilterMenu({
  maxHours,
  filters
}: GamesFilterMenuProps) {
  const { setParam, deleteParam } = useURLSearchParams();
  const { togglePopup } = usePopupState();

  const onGameSearch = (query?: string) => {
    if (!query) deleteParam('name');
    else setParam('name', query);

    return Promise.resolve(undefined);
  };

  return (
    <>
      <div className='filters-menu'>
        <Search
          id='games-search'
          name='Search game'
          defaultQuery={filters.name}
          action={onGameSearch}
          onSearchSubmit={onGameSearch}
          placeholder='Search games'
        />

        <Button
          variant='outlined'
          onClick={() => togglePopup(ADVANCE_SEARCH_POPUP)}
        >
          Advance search
        </Button>
      </div>

      <AdvanceSearch
        maxHours={maxHours}
        defaultFilters={removeNonFormFields(filters)}
        popupName={ADVANCE_SEARCH_POPUP}
      />
    </>
  );
}
