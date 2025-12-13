'use client';

import { useMemo, useRef, useState } from 'react';
import { Search } from '@mynaui/icons-react';

import { Option, TextInputProps } from '@ts/ui/components-props';

import Input from './Input';
import Picker from './Picker';
import Hint from './Hint';
import { emptyOption } from '@lib/utils';

type SearchSelectProps = TextInputProps & {
  options: Option[];
  onSelect?: (value: string) => void;
};

const SEARCH_COOLDOWN = 1500;

export default function SearchSelect({
  id,
  name,
  options,
  className,
  label,
  defaultValue,
  disabled = false,
  errorHint,
  hint,
  onSelect
}: SearchSelectProps) {
  const initiaOption = useMemo(
    () =>
      options.find((option) => option.value === defaultValue)
      ?? options[0]
      ?? emptyOption,
    [options, defaultValue]
  );

  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [option, setOption] = useState<Option>(initiaOption);

  const searchRef = useRef<HTMLInputElement>(null);
  const timer = useRef<NodeJS.Timeout>(null);

  const filterOptions = (query: string) =>
    new Promise<Option[]>((resolve) => {
      const filtered = options.filter((opt) =>
        opt.label.toLowerCase().includes(query)
      );
      resolve(filtered);
    });

  const updateFilterOptions = async (query: string, auto: boolean = false) => {
    const lowQuery = query.toLowerCase().trim();

    if (!lowQuery) {
      setOption(options[0]);
      setFilteredOptions(options);
      return;
    }

    const filtered = await filterOptions(lowQuery);
    if (auto && searchRef.current && filtered[0]) {
      setFilteredOptions([filtered[0]]);
      setOption(filtered[0]);
      searchRef.current.value = filtered[0].label;
    } else {
      setFilteredOptions(filtered);
    }
  };

  const onOptionSelect = async (newOption: Option) => {
    await updateFilterOptions(newOption.label);

    setOption(newOption);
    onSelect?.(newOption.value);

    if (searchRef.current) searchRef.current.value = newOption.label;
  };

  const onQuerySearch = (query: string) => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      updateFilterOptions(query);
    }, SEARCH_COOLDOWN);
  };

  const onBlur = async () => {
    if (searchRef.current)
      await updateFilterOptions(searchRef.current.value, true);
  };

  return (
    <div className={`input-select-group ${className}`}>
      <label htmlFor={id} id={`${id}-label`}>
        {label}
      </label>

      <div className='select-picker select-search'>
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

        <Input
          id={`${id}-search`}
          ref={searchRef}
          name={`${name}-search`}
          icon={<Search className='input-icon' />}
          disabled={disabled}
          onChange={onQuerySearch}
          onBlur={onBlur}
          defaultValue={initiaOption.label}
        />

        <Picker
          focusId={`${id}-search`}
          options={filteredOptions}
          isCurrent={(opt) => opt.value === option.value}
          inputId={id}
          onSelect={onOptionSelect}
          renderOption={(option) => option.label}
        />
      </div>

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
