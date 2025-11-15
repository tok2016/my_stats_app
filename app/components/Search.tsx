'use client';

import { KeyboardEvent, useRef } from 'react';
import { Search as SearchIcon } from '@mynaui/icons-react';

import { SearchProps } from '@ts/ui/components-props';

export default function Search({
  id,
  name,
  placeholder,
  className = '',
  onSearch,
  onFocus,
  onBlur
}: SearchProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  const onSearchSubmit = () => {
    if (searchRef.current?.value) {
      onSearch(searchRef.current.value);
    }
  };

  const onEnterDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <div className={`input-select-group ${className}`}>
      <div className='input-wrapper'>
        <input
          id={id}
          name={name}
          ref={searchRef}
          type='search'
          placeholder={placeholder}
          onKeyDown={onEnterDown}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        <SearchIcon className='input-icon' onClick={onSearchSubmit} />
      </div>
    </div>
  );
}
