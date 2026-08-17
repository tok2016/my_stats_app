'use client';

import { MouseEvent, useEffect, useRef, useState } from 'react';

import { SliderProps } from '@ts/ui/components-props';

import Hint from './Hint';
import NumberInput from './NumberInput';

const MAX_ANGLE = 360;
const STRAIGHT_ANGLE = 180;
const TURN_ANGLE = 450;

type CircleSliderProps = SliderProps & {
  defaultValue?: number;
  onChange?: (value?: number) => void;
};

export default function CircleSlider({
  label,
  id,
  name,
  min,
  max,
  className = '',
  errorHint,
  hint,
  defaultValue,
  onChange
}: CircleSliderProps) {
  const [value, setValue] = useState<number>(defaultValue ?? min);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef<boolean>(false);

  const onNumberChange = (value?: number) => {
    if (sliderRef.current) {
      setValue(value ?? min);
      onChange?.(value);
    }
  };

  const onMouseDown = () => {
    isMouseDown.current = true;
  };

  const onMouseMove = (evt: MouseEvent<HTMLDivElement>) => {
    if (sliderRef.current && isMouseDown.current) {
      const { left, top } = sliderRef.current.getBoundingClientRect();

      const closeCathetus =
        evt.pageX - left - window.scrollX - sliderRef.current.offsetWidth / 2;
      const farCathetus =
        evt.pageY - top - window.scrollY - sliderRef.current.offsetHeight / 2;

      const angle =
        Math.round(
          (Math.atan2(farCathetus, closeCathetus) * STRAIGHT_ANGLE) / Math.PI
            + TURN_ANGLE
        ) % MAX_ANGLE;

      const newValue = Math.round((max * angle) / MAX_ANGLE);
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const onMouseRelease = () => {
    isMouseDown.current = false;
  };

  useEffect(() => {
    if (sliderRef.current) {
      const angle = Math.round((value * MAX_ANGLE) / max);
      sliderRef.current.style.setProperty('--angle', `${angle}deg`);
    }
  }, [value, max]);

  return (
    <div className={`circle-slider-group ${className}`}>
      <label htmlFor={id}>{label}</label>
      <div
        ref={sliderRef}
        className='circle-slider'
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseRelease}
        onMouseEnter={onMouseRelease}
      >
        <input
          id={id}
          name={name}
          value={value}
          type='range'
          min={min}
          max={max}
          onChange={() => {}}
        />

        <span className='value'>{value ?? 'NR'}</span>
      </div>

      <NumberInput
        id={`${id}-number`}
        name={name}
        value={value}
        onChange={onNumberChange}
        min={min}
        max={max}
      />

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
