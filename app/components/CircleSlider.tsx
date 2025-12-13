'use client';

import { MouseEvent, useRef, useState } from 'react';

import { SliderProps } from '@ts/ui/components-props';

import Hint from './Hint';

const MAX_ANGLE = 360;
const STRAIGHT_ANGLE = 180;
const TURN_ANGLE = 450;

type CircleSliderProps = SliderProps & {
  defaultValue?: number;
  onChange?: (value: number) => void;
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

  const onMouseDown = () => {
    isMouseDown.current = true;
  };

  const onMouseMove = (evt: MouseEvent<HTMLDivElement>) => {
    if (sliderRef.current && isMouseDown.current) {
      const closeCathetus =
        evt.pageX
        - sliderRef.current.offsetLeft
        - sliderRef.current.offsetWidth / 2;
      const farCathetus =
        evt.pageY
        - sliderRef.current.offsetTop
        - sliderRef.current.offsetHeight / 2;

      const angle =
        Math.round(
          (Math.atan2(farCathetus, closeCathetus) * STRAIGHT_ANGLE) / Math.PI
            + TURN_ANGLE
        ) % MAX_ANGLE;
      sliderRef.current.style.setProperty('--angle', `${angle}deg`);

      const newValue = Math.round((max * angle) / MAX_ANGLE);
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const onMouseRelease = () => {
    isMouseDown.current = false;
  };

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

        <span className='value'>{value}</span>
      </div>

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
