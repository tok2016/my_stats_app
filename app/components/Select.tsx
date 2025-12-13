'use client';

import { memo, useMemo, useRef, useState } from 'react';
import { ChevronDown } from '@mynaui/icons-react';

import { SelectVariant } from '@ts/ui/components-variants';
import { TextInputProps, Option } from '@ts/ui/components-props';

import Hint from './Hint';
import Picker from './Picker';
import { emptyOption } from '@lib/utils';

type SelectProps = TextInputProps & {
  options: Option[];
  variant?: SelectVariant;
  onSelect?: (value: string) => void;
};

type SelectVariantProps = {
  labelGroupClass: string;
  selectGroupClass: string;
};

const EXPAND_ICON_CLASS_NAME = 'picker-icon';

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

function SelectRaw({
  label,
  id,
  name,
  options,
  variant = 'plain',
  className = '',
  disabled = false,
  defaultValue,
  hint,
  errorHint,
  onSelect
}: SelectProps) {
  const defaultOption = useMemo(
    () =>
      options.find((option) => option.value === defaultValue)
      ?? options[0]
      ?? emptyOption,
    [options, defaultValue]
  );

  const [option, setOption] = useState<Option>(defaultOption);
  const expandIconRef = useRef<SVGSVGElement>(null);

  const onOptionSelect = (newOption: Option) => {
    setOption(newOption);
    onSelect?.(newOption.value);
  };

  const onExpand = (isExpanded: boolean) => {
    if (expandIconRef.current)
      expandIconRef.current.classList = `${EXPAND_ICON_CLASS_NAME} ${isExpanded ? 'expanded' : ''}`;
  };

  return (
    <div className={`${SelectTypes[variant].labelGroupClass} ${className}`}>
      <label htmlFor={id} id={`${id}-label`}>
        {label}
      </label>

      <div className={SelectTypes[variant].selectGroupClass}>
        <select
          id={id}
          name={name}
          value={option.value}
          disabled={disabled}
          onChange={() => {}}
        >
          {options.map((option) => (
            <option hidden key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div id={`${id}-label`} className='select'>
          <span id={`${id}-label`}>{option.label}</span>
          <ChevronDown
            ref={expandIconRef}
            id={`${id}-label`}
            className={EXPAND_ICON_CLASS_NAME}
          />
        </div>

        <Picker
          options={options}
          isCurrent={(opt) => opt.value === option.value}
          inputId={id}
          onSelect={onOptionSelect}
          onExpand={onExpand}
          renderOption={(option) => option.label}
        />
      </div>

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}

const Select = memo(SelectRaw);
export default Select;
