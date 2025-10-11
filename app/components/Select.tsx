'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

import { InputTheme, SelectVariant } from '@ts/ui/components-variants';

import { getIconCode } from '@lib/utils';

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  id: string;
  options: Option[];
  theme?: InputTheme;
  variant?: SelectVariant;
  className?: string;
  onSelect?: (value: string) => void;
};

type SelectVariantProps = {
  labelGroupClass: string;
  selectGroupClass: string;
};

const SelectTypes: Record<SelectVariant, SelectVariantProps> = {
  plain: {
    labelGroupClass: 'input-select-group',
    selectGroupClass: 'select-picker'
  },
  text: {
    labelGroupClass: 'text-select-group',
    selectGroupClass: 'text-select-picker'
  }
};

export default function Select({
  label,
  id,
  options,
  theme = 'light',
  variant = 'plain',
  className,
  onSelect
}: SelectProps) {
  const [value, setValue] = useState<string>(options[0].value);
  const [isExpanded, setExpanded] = useState<boolean>(false);

  const onOptionClick = (value: string) => {
    setValue(value);
    setExpanded(false);
    onSelect?.(value);
  };

  useEffect(() => {
    const onClose = (evt: MouseEvent) => {
      const { target } = evt;
      setExpanded(target instanceof Element && target.id?.includes(id));
    };
    window.addEventListener('click', onClose);

    return () => window.removeEventListener('click', onClose);
  }, []);

  return (
    <div
      className={`${SelectTypes[variant].labelGroupClass} ${theme} ${className}`}
    >
      <label htmlFor={id} id={`${id}-label`}>
        {label}
      </label>

      <div className={SelectTypes[variant].selectGroupClass}>
        <select id={id} value={value} onChange={() => {}}>
          {options.map((option) => (
            <option disabled hidden key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div id={`${id}-label`} className='select'>
          <span id={`${id}-label`}>{value}</span>
          <Icon
            id={`${id}-label`}
            icon={getIconCode('chevron-down')}
            className={`picker-icon ${isExpanded ? 'expanded' : ''}`}
          />
        </div>

        <ul className={`picker ${isExpanded ? '' : 'hidden'}`}>
          {options.map((option) => (
            <li
              key={option.value}
              className={`option ${option.value === value ? 'selected' : ''}`}
              onClick={() => onOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
