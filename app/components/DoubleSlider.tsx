'use client';

import { ChangeEvent, useRef, useState } from 'react';

import { SliderProps } from '@ts/ui/components-props';

import '@styles/_number-inputs.scss';

import Hint from './Hint';

type DoubleSliderProps = Omit<SliderProps, 'name' | 'id'> & {
  leftId: string;
  rightId: string;
  leftName: string;
  rightName: string;
  defaultValues?: [number, number];
  valueUnit?: string;
  onChange?: (left: number, right: number) => void;
};

const normalize = (value: number, min: number, max: number): number =>
  (value / Math.abs(max - min)) * 100;

export default function DoubleSlider({
  label,
  leftId,
  rightId,
  leftName,
  rightName,
  min,
  max,
  valueUnit,
  className = '',
  errorHint,
  hint,
  defaultValues,
  onChange
}: DoubleSliderProps) {
  const [left, setLeft] = useState<number>(
    defaultValues ? defaultValues[0] : min
  );

  const [right, setRight] = useState<number>(
    defaultValues ? defaultValues[1] : max
  );

  const trackRef = useRef<HTMLInputElement>(null);

  const onRangeChange =
    (isLeft: boolean) => (evt: ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(evt.target.value);
      const leftValue = isLeft ? value : left;
      const rightValue = isLeft ? right : value;

      if (trackRef.current) {
        const normalLeft = normalize(leftValue, min, max);
        const normalRight = normalize(rightValue, min, max);

        trackRef.current.style.left = `${normalRight > normalLeft ? normalLeft : normalRight}%`;
        trackRef.current.style.width = `${Math.abs(normalRight - normalLeft)}%`;
      }

      setLeft(leftValue);
      setRight(rightValue);
      onChange?.(leftValue, rightValue);
    };

  return (
    <div className={`input-select-group ${className}`}>
      <label htmlFor={leftId} className='slider-label'>
        <span>{label}</span>
        <span>
          {valueUnit}
          {left > right ? right : left}-{right > left ? right : left}
        </span>
      </label>

      <div className='double-slider'>
        <div className='slider-background' ref={trackRef}></div>
        <input
          type='range'
          id={leftId}
          name={leftName}
          className='left'
          value={left}
          min={min}
          max={max}
          onChange={onRangeChange(true)}
        />
        <input
          type='range'
          id={rightId}
          name={rightName}
          className='right'
          value={right}
          min={min}
          max={max}
          onChange={onRangeChange(false)}
        />
        <div className='slider-track' ref={trackRef}></div>
      </div>

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
