'use client';

import { KeyboardEvent, useRef } from 'react';
import { Icon } from '@iconify/react';

import { InputBaseProps } from '@ts/ui/components-props';

import { getIconCode } from '@lib/utils';

type SearchProps = Omit<InputBaseProps, 'label' | 'errorHint' | 'hint'> & {
  placeholder?: string;
  onSearch: (query: string) => void;
};

export default function Search({
  id,
  name,
  placeholder,
  className = '',
  onSearch
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
        />

        <Icon
          className='input-icon'
          icon={getIconCode('search')}
          onClick={onSearchSubmit}
        />
      </div>
    </div>
  );
}
