'use client';

import { KeyboardEvent, useState } from 'react';
import { Icon } from '@iconify/react';

import { TextInputProps } from '@ts/ui/components-props';

import { getIconCode } from '@lib/utils';

type SearchProps = Omit<TextInputProps, 'onChange' | 'value'> & {
  onSearch: (query: string) => void;
};

export default function Search({
  label,
  id,
  placeholder,
  className = '',
  onSearch
}: SearchProps) {
  const [query, setQuery] = useState<string>('');

  const onSearchSubmit = () => {
    if (query) {
      onSearch(query);
    }
  };

  const onEnterDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <div className={`input-select-group ${className}`}>
      <label hidden={!label} htmlFor={id}>
        {label}
      </label>

      <div className='search-group'>
        <input
          id={id}
          type='search'
          placeholder={placeholder}
          value={query}
          onChange={(evt) => setQuery(evt.target.value)}
          onKeyDown={onEnterDown}
        />

        <Icon
          className='search-icon'
          icon={getIconCode('search')}
          onClick={onSearchSubmit}
        />
      </div>
    </div>
  );
}
