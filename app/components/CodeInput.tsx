'use client';

import {
  ChangeEvent,
  ClipboardEvent,
  createRef,
  KeyboardEvent,
  RefObject,
  useRef
} from 'react';

import { TextInputProps } from '@ts/ui/components-props';

import Hint from './Hint';
import { CODE_LENGTH } from '@lib/utils';

export default function CodeInput({
  label,
  id,
  name,
  className,
  errorHint,
  hint
}: TextInputProps) {
  const codeRef = useRef<HTMLInputElement>(null);
  const numberRefs = useRef<RefObject<HTMLInputElement>[]>([]);

  if (numberRefs.current.length < CODE_LENGTH) {
    numberRefs.current = Array.from(
      { length: CODE_LENGTH },
      (_, i) => numberRefs.current[i] || createRef<HTMLInputElement>()
    );
  }

  const onNumberChange =
    (index: number) => (evt: ChangeEvent<HTMLInputElement>) => {
      const currentValue = evt.target.value.trim().at(-1);

      if (currentValue) {
        if (index < CODE_LENGTH - 1) {
          numberRefs.current[index + 1]?.current.focus();
        } else {
          numberRefs.current[index]?.current.blur();
        }
      }

      numberRefs.current[index].current.value = currentValue ?? '';

      if (codeRef.current) {
        codeRef.current.value = numberRefs.current
          .map((ref, i) =>
            i === index ? (currentValue ?? ' ') : ref.current.value
          )
          .join('');
      }
    };

  const onNumberFocus = (index: number) => () => {
    if (!numberRefs.current[index].current.value) {
      for (let i = 0; i < numberRefs.current.length; i++) {
        if (!numberRefs.current[i].current.value) {
          numberRefs.current[i].current.focus();
          break;
        }
      }
    } else {
      numberRefs.current[index].current.setSelectionRange(1, 1);
    }
  };

  const onArrowDown = (index: number) => (evt: KeyboardEvent) => {
    const left = evt.key === 'ArrowLeft';
    const right = evt.key === 'ArrowRight';

    if (left || right) {
      evt.preventDefault();
    }

    if (left && index > 0) {
      numberRefs.current[index].current.blur();
      numberRefs.current[index - 1].current.focus();
    } else if (right && index < numberRefs.current.length - 1) {
      numberRefs.current[index].current.blur();
      numberRefs.current[index + 1].current.focus();
    }
  };

  const onPaste = (evt: ClipboardEvent) => {
    evt.preventDefault();

    const code = evt.clipboardData.getData('text').trim();

    for (let i = 0; i < code.length; i++) {
      numberRefs.current[i].current.value = code[i];
    }

    if (codeRef.current) {
      codeRef.current.value = code;
    }
  };

  return (
    <div className={`input-select-group ${className}`}>
      <label hidden={!label} htmlFor={`${id}-0`}>
        {label}
      </label>

      <input ref={codeRef} type='text' id={id} name={name} className='hidden' />

      <div className='code-input'>
        {Array.from({ length: CODE_LENGTH }, (_v, i) => (
          <input
            key={i}
            ref={numberRefs.current[i]}
            type='text'
            id={`${id}-${i}`}
            onChange={onNumberChange(i)}
            onFocus={onNumberFocus(i)}
            onKeyDown={onArrowDown(i)}
            onPaste={onPaste}
            autoComplete='off'
            placeholder=''
          />
        ))}
      </div>

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
