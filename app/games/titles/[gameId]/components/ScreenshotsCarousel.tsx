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

/**
 * @param props
 * @param props.screenshots - Screenshots of game.
 * @param props.gameName - Name of the game.
 * @param props.groupKey - Screenshots key.
 * @returns Screenshot preview with screenshots carousel.
 */
export default function ScreenshotsCarousel({
  screenshots,
  groupKey,
  gameName
}: ScreenshotsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  //Index of screenshot to preview. Reduce function scrolls to screenshot of given index.
  const [index, setIndex] = useReducer((prev, next: number) => {
    //Wraps the next value to not let it get beyond the array.
    const warpedNext = next % screenshots.length;

    if (carouselRef.current) {
      //Calculates the gap between element is screenshot.
      const first = carouselRef.current.children.item(0);
      const second = carouselRef.current.children.item(1);

      if (first && isHTMLElement(first)) {
        let gap = 0;

        if (second && isHTMLElement(second))
          gap = Math.abs(
            second.offsetLeft - first.offsetLeft - first.offsetWidth
          );

        //Scrolls the carousel to screenshot of next index.
        carouselRef.current.scrollLeft =
          warpedNext * (first.scrollWidth + gap)
          - (warpedNext > prev
            ? 0
            : carouselRef.current.clientWidth - first.scrollWidth);
      }
    }

    //Scrolls the preview container to screenshot of next index.
    if (previewRef.current) {
      const first = previewRef.current.firstChild;
      if (first && isHTMLElement(first)) {
        previewRef.current.scrollLeft =
          warpedNext * first.scrollWidth
          - (warpedNext > prev
            ? 0
            : previewRef.current.clientWidth - first.scrollWidth);
      }
    }

    return warpedNext;
  }, 0);

  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  /**
   * Stops and clears timeout.
   */
  const stopScrollTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  /**
   * Starts the timeout to show the next screenshot.
   */
  const waitForSroll = useCallback(() => {
    stopScrollTimeout();

    timeoutRef.current = setTimeout(() => {
      setIndex(index + 1);
    }, SECONDES_TO_SCROLL);
  }, [setIndex, index, stopScrollTimeout]);

  //Starts the scroll timeout everytime index changes.
  useEffect(() => {
    waitForSroll();
    return stopScrollTimeout;
  }, [waitForSroll, stopScrollTimeout, index]);

  //Adjust the scroll position on window resize.
  useEffect(() => {
    let previewWidth = previewRef.current?.clientWidth ?? 0;
    const onResize = () => {
      const currentWidth = previewRef.current?.clientWidth ?? 0;

      if (previewWidth - currentWidth !== 0) setIndex(index);

      previewWidth = previewRef.current?.clientWidth ?? 0;
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [index]);

  return (
    <div className='screenshots-collage'>
      {/*Preview is a horizontal flexbox of screenshot with hidden overflow*/}
      <div className='screenshots-collage__preview' ref={previewRef}>
        {screenshots.map((screenshot, i) => (
          <FetchImage
            key={`${groupKey}-${i}-title`}
            className='screenshot'
            src={screenshot}
            alt={`Screenshot ${i + 1} of ${gameName}`}
          />
        ))}
      </div>

      {/*Carousel is a scrollable flexbox of clickable screenshots*/}
      <div
        className='screenshots-collage__carousel'
        ref={carouselRef}
        onScroll={stopScrollTimeout}
        onScrollEnd={waitForSroll}
      >
        {screenshots.map((screenshot, i) => (
          <FetchImage
            key={`${groupKey}-${i}`}
            src={screenshot}
            alt={`Screenshot ${i + 1} of ${gameName}`}
            className={`screenshot screenshot--clickable ${i === index ? 'screenshot--choosen' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
