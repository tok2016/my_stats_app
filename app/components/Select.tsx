'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

import { SelectVariant } from '@ts/ui/components-variants';
import { TextInputProps, Option } from '@ts/ui/components-props';

import { getIconCode } from '@lib/utils';
import Hint from './Hint';

type SelectProps = TextInputProps & {
  options: Option[];
  variant?: SelectVariant;
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
  name,
  options,
  variant = 'plain',
  className = '',
  defaultValue,
  hint,
  errorHint,
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
  }, [id]);

  return (
    <div className={`${SelectTypes[variant].labelGroupClass} ${className}`}>
      <label htmlFor={id} id={`${id}-label`}>
        {label}
      </label>

      <div className={SelectTypes[variant].selectGroupClass}>
        <select
          id={id}
          name={name}
          defaultValue={defaultValue}
          value={value}
          onChange={() => {}}
        >
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

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
