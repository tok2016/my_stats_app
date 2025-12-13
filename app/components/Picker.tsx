'use client';

import { useEffect, useReducer, useState } from 'react';

type TestProps<T> = {
  options: (T & { key: string })[];
  inputId: string;
  focusId?: string;
  className?: string;
  renderOption: (option: T) => React.ReactNode;
  isCurrent?: (option: T) => boolean;
  onSelect?: (option: T) => void;
  onExpand?: (isExpanded: boolean) => void;
};

const PERCENT_TO_CHANGE_POSITION = 0.67;

export default function Picker<T>({
  options,
  inputId,
  focusId,
  className,
  isCurrent,
  renderOption,
  onSelect,
  onExpand
}: TestProps<T>) {
  const [isExpanded, toggleExpand] = useReducer((_prev, curr) => {
    onExpand?.(curr);
    return curr;
  }, false);

  const [pickerPosition, setPickerPosition] = useState<'upper' | ''>('');

  const onOptionClick = (newOption: T) => {
    onSelect?.(newOption);
    toggleExpand(false);
  };

  useEffect(() => {
    const onExpand = (evt: MouseEvent) => {
      const { target } = evt;
      toggleExpand(
        (target instanceof Element && target.id?.includes(inputId))
          || focusId === document.activeElement?.id
      );

      setPickerPosition(
        evt.clientY > window.innerHeight * PERCENT_TO_CHANGE_POSITION
          ? 'upper'
          : ''
      );
    };
    window.addEventListener('click', onExpand);

    return () => window.removeEventListener('click', onExpand);
  }, [inputId, focusId]);

  if (!options.length) return;

  return (
    <ul
      className={`picker ${isExpanded ? '' : 'hidden'} ${pickerPosition} ${className}`}
    >
      {options.map((opt) => (
        <li
          key={opt.key}
          className={`option ${isCurrent?.(opt) ? 'selected' : ''}`}
          onClick={() => onOptionClick(opt)}
        >
          {renderOption(opt)}
        </li>
      ))}
    </ul>
  );
}
