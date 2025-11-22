'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from '@mynaui/icons-react';

import { SelectVariant } from '@ts/ui/components-variants';
import { TextInputProps, Option } from '@ts/ui/components-props';

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

const PERCENT_TO_CHANGE_POSITION = 0.67;

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
  const [option, setOption] = useState<Option>(options[0]);
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [pickerPosition, setPickerPosition] = useState<'upper' | ''>('');

  const onOptionClick = (newOption: Option) => {
    setOption(newOption);
    setExpanded(false);
    onSelect?.(newOption.value);
  };

  useEffect(() => {
    const onExpand = (evt: MouseEvent) => {
      const { target } = evt;
      setExpanded(target instanceof Element && target.id?.includes(id));

      setPickerPosition(
        evt.clientY > window.innerHeight * PERCENT_TO_CHANGE_POSITION
          ? 'upper'
          : ''
      );
    };
    window.addEventListener('click', onExpand);

    return () => window.removeEventListener('click', onExpand);
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
          value={option.value}
          onChange={() => {}}
        >
          {options.map((option) => (
            <option disabled hidden key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div id={`${id}-label`} className='select'>
          <span id={`${id}-label`}>{option.label}</span>
          <ChevronDown
            id={`${id}-label`}
            className={`picker-icon ${isExpanded ? 'expanded' : ''}`}
          />
        </div>

        <ul
          className={`picker ${isExpanded ? '' : 'hidden'} ${pickerPosition}`}
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`option ${opt.value === option.value ? 'selected' : ''}`}
              onClick={() => onOptionClick(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      </div>

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
