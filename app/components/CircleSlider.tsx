'use client';

import { MouseEvent, useRef, useState } from 'react';

import { SliderProps } from '@ts/ui/components-props';

const MAX_ANGLE = 360;
const STRAIGHT_ANGLE = 180;
const TURN_ANGLE = 450;

type CircleSliderProps = SliderProps & {
  onChange?: (value: number) => void;
};

type CircleSliderState = {
  isDown: boolean;
  startPosX: number;
  startPosY: number;
  endPosX: number;
  endPosY: number;
};

export default function CircleSlider({
  label,
  id,
  min,
  max,
  className = '',
  onChange
}: CircleSliderProps) {
  const [value, setValue] = useState<number>(min);

  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderState = useRef<CircleSliderState>({
    isDown: false,
    startPosX: 0,
    startPosY: 0,
    endPosX: 0,
    endPosY: 0
  });

  const onMouseDown = () => {
    sliderState.current.isDown = true;
  };

  const onMouseMove = (evt: MouseEvent<HTMLDivElement>) => {
    if (sliderRef.current && sliderState.current.isDown) {
      const closeCathetus =
        evt.clientX
        - sliderRef.current.offsetLeft
        - sliderRef.current.offsetWidth / 2;
      const farCathetus =
        evt.clientY
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
    sliderState.current.isDown = false;
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
          value={value}
          type='range'
          min={min}
          max={max}
          onChange={() => {}}
        />

        <span className='value'>{value}</span>
      </div>
    </div>
  );
}
