'use client';

import { ChangeEvent, useRef, useState } from 'react';

import '@styles/_number-inputs.scss';

type DoubleSliderProps = {
  label?: string;
  min: number;
  max: number;
  valueUnit?: string;
  onChange?: (left: number, right: number) => void;
};

const normalize = (value: number, min: number, max: number): number =>
  (value / Math.abs(max - min)) * 100;

export default function DoubleSlider({
  label,
  min,
  max,
  valueUnit,
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

      console.log(isLeft);

      setLeft(leftValue);
      setRight(rightValue);
      onChange?.(leftValue, rightValue);
    };

  return (
    <div className='input-select-group'>
      <label className='slider-label'>
        <span>{label}</span>
        <span>
          {valueUnit}
          {min}-{max}
        </span>
      </label>

      <div className='double-slider'>
        <div className='slider-background' ref={trackRef}></div>
        <input
          type='range'
          className='left'
          value={left}
          min={min}
          max={max}
          onChange={onRangeChange(true)}
        />
        <input
          type='range'
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
