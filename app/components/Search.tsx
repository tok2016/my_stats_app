'use client';

import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useState
} from 'react';
import { Search as SearchIcon } from '@mynaui/icons-react';

import { SearchBaseProps } from '@ts/ui/components-props';

import Picker from './Picker';
import { useAction } from '@lib/hooks';

const SEARCH_COOLDOWN = 1500;

type SearchProps<T> = SearchBaseProps & {
  defaultQuery?: string;
  renderOption?: (option: T) => React.ReactNode;
  action: (query?: string) => Promise<(T & { key: string })[]>;
  onOptionSelect?: (option: T) => void;
  onSearchSubmit: (query: string) => void;
};

export default function Search<T>({
  id,
  name,
  placeholder,
  defaultQuery = '',
  className = '',
  renderOption,
  action,
  onOptionSelect,
  onSearchSubmit,
  onFocus,
  onBlur
}: SearchProps<T>) {
  const [options, search] = useAction(action, []);
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
    const timer = setTimeout(() => search(query), SEARCH_COOLDOWN);
    return () => clearTimeout(timer);
  }, [query, search]);

  return (
    <div className={`input-select-group ${className}`}>
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

        <SearchIcon className='input-icon' onClick={onSubmit} />
      </div>

      {!renderOption || (
        <Picker
          inputId={id}
          options={options}
          renderOption={renderOption}
          onSelect={onOptionSelect}
        />
      )}
    </div>
  );
}
