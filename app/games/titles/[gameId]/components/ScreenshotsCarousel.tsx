'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';

import { isHTMLElement } from '@lib/type-guards';

import FetchImage from '@components/FetchImage';

type ScreenshotsCarouselProps = {
  screenshots: string[];
  gameName: string;
  groupKey: string;
};

const SECONDES_TO_SCROLL = 7000;

export default function ScreenshotsCarousel({
  screenshots,
  groupKey,
  gameName
}: ScreenshotsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useReducer((prev, next: number) => {
    const warpedNext = next % screenshots.length;

    if (carouselRef.current) {
      const first = carouselRef.current.children.item(0);
      const second = carouselRef.current.children.item(1);

      if (first && isHTMLElement(first)) {
        let gap = 0;

        if (second && isHTMLElement(second))
          gap = Math.abs(
            second.offsetLeft - first.offsetLeft - first.offsetWidth
          );

        carouselRef.current.scrollLeft =
          warpedNext * (first.scrollWidth + gap)
          - (warpedNext > prev
            ? 0
            : carouselRef.current.clientWidth - first.scrollWidth);
      }
    }

    if (titleRef.current) {
      const first = titleRef.current.firstChild;
      if (first && isHTMLElement(first)) {
        titleRef.current.scrollLeft =
          warpedNext * first.scrollWidth
          - (warpedNext > prev
            ? 0
            : titleRef.current.clientWidth - first.scrollWidth);
      }
    }

    return warpedNext;
  }, 0);

  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  const stopScrollTimeout = useCallback(() => {
    if (timeoutRef.current) {
      console.log('stop');
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const waitForSroll = useCallback(() => {
    stopScrollTimeout();
    console.log('wait');
    timeoutRef.current = setTimeout(() => {
      setIndex(index + 1);
    }, SECONDES_TO_SCROLL);
  }, [setIndex, index, stopScrollTimeout]);

  useEffect(() => {
    console.log(index);
    waitForSroll();
    return stopScrollTimeout;
  }, [waitForSroll, stopScrollTimeout, index]);

  return (
    <div className='screenshots-collage'>
      <div className='title-screenshot' ref={titleRef}>
        {screenshots.map((screenshot, i) => (
          <FetchImage
            key={`${groupKey}-${i}-title`}
            className='screenshot'
            src={screenshot}
            alt={`Screenshot ${i + 1} of ${gameName}`}
          />
        ))}
      </div>

      <div
        className='screenshots-carousel'
        ref={carouselRef}
        onScroll={stopScrollTimeout}
        onScrollEnd={waitForSroll}
      >
        {screenshots.map((screenshot, i) => (
          <FetchImage
            key={`${groupKey}-${i}`}
            src={screenshot}
            alt={`Screenshot ${i + 1} of ${gameName}`}
            className={`clickable screenshot ${i === index ? 'choosen' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
