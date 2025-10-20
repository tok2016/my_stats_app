'use client';

import { ChangeEvent, useRef, useState } from 'react';

import { SliderProps } from '@ts/ui/components-props';

import '@styles/_number-inputs.scss';

type DoubleSliderProps = SliderProps & {
  valueUnit?: string;
  onChange?: (left: number, right: number) => void;
};

const normalize = (value: number, min: number, max: number): number =>
  (value / Math.abs(max - min)) * 100;

export default function DoubleSlider({
  label,
  id,
  min,
  max,
  valueUnit,
  className = '',
  onChange
}: DoubleSliderProps) {
  const [left, setLeft] = useState<number>(min);
  const [right, setRight] = useState<number>(max);

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
      <label htmlFor={id} className='slider-label'>
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
          id={id}
          className='left'
          value={left}
          min={min}
          max={max}
          onChange={onRangeChange(true)}
        />
        <input
          type='range'
          id={`${id}-right`}
          className='right'
          value={right}
          min={min}
          max={max}
          onChange={onRangeChange(false)}
        />
        <div className='slider-track' ref={trackRef}></div>
      </div>
    </div>
  );
}
