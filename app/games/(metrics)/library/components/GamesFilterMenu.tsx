'use client';

import { GamesFilter } from '@ts/games/filter';

import { useURLSearchParams } from '@lib/hooks';

import { usePopupState } from '@store/popup-store';

import Button from '@components/Button';
import Search from '@components/Search';

import { NonFormFilterFields } from '../../utils';
import { GamesFilterFormData } from '../types';
import AdvanceSearch from './AdvanceSearch';

type GamesFilterMenuProps = {
  maxHours: number;
  filters: GamesFilter;
  disabled?: boolean;
};

const ADVANCE_SEARCH_POPUP = 'advance-search-menu';

/**
 * @param filters - Filters from search params.
 * @returns Filters data wihout fields that can't be controlled by form.
 */
const removeNonFormFields = (filters: GamesFilter): GamesFilterFormData => {
  const formFilters = { ...filters };
  NonFormFilterFields.forEach((field) => {
    delete formFilters[field];
  });

  return formFilters;
};

/**
 * @param props
 * @param props.maxHours - Max playtime among all user's games in hours.
 * @param props.filters - Filters from search params.
 * @param props.disabled - It true, disables all inputs and buttons.
 * @returns
 */
export default function GamesFilterMenu({
  maxHours,
  filters,
  disabled = false
}: GamesFilterMenuProps) {
  const { setParam, deleteParam } = useURLSearchParams();
  const { togglePopup } = usePopupState();

  /**
   * Sets name param with given query value.
   * @param query - Name of game to filter by.
   */
  const onGameSearch = (query?: string) => {
    if (!query) deleteParam('name');
    else setParam('name', query);
  };

  return (
    <>
      <div className='filters-menu'>
        <Search
          id='games-search'
          name='Search game'
          defaultQuery={filters.name}
          onSearchSubmit={onGameSearch}
          placeholder='Search games'
          disabled={disabled}
        />

        <Button
          variant='outlined'
          disabled={disabled}
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
