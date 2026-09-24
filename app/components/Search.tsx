'use client';

import { Search as SearchIcon } from '@mynaui/icons-react';
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useState
} from 'react';

import { SearchBaseProps } from '@ts/ui/components-props';

import Picker from './Picker';
import Spinner from './Spinner';

const SEARCH_COOLDOWN = 1000;

type SearchProps<T extends { key: string }> = SearchBaseProps & {
  defaultQuery?: string;
  options?: T[];
  loading?: boolean;
  renderOption?: (option: T) => React.ReactNode;
  onOptionSelect?: (option: T) => void;
  onType?: (query?: string) => void;
  onSearchSubmit: (query?: string) => void;
};

export default function Search<T extends { key: string }>({
  id,
  name,
  placeholder,
  defaultQuery = '',
  className = '',
  loading,
  options,
  renderOption,
  onOptionSelect,
  onType,
  onSearchSubmit,
  onFocus,
  onBlur
}: SearchProps<T>) {
  const [query, setQuery] = useState<string>(defaultQuery);

  const onSubmit = () => {
    onSearchSubmit(query);
  };

  const onEnterDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter') {
      onSubmit();
    }
  };

  const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setQuery(evt.target.value);
  };

  useEffect(() => {
    if (onType) {
      const timer = setTimeout(() => {
        onType(query);
      }, SEARCH_COOLDOWN);

      return () => clearTimeout(timer);
    }
  }, [query, onType]);

  return (
    <div className={`input-select-group select-search ${className}`}>
      <div className='input-wrapper'>
        <input
          id={id}
          name={name}
          value={query}
          type='search'
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onEnterDown}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        {loading ? (
          <Spinner className='input-icon' />
        ) : (
          <SearchIcon className='input-icon' onClick={onSubmit} />
        )}
      </div>

      {renderOption && options && (
        <Picker
          focusId={id}
          inputId={id}
          options={options}
          renderOption={renderOption}
          onSelect={onOptionSelect}
        />
      )}
    </div>
  );
}
