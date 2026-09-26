'use client';

import { VectorMap } from '@south-paw/react-vector-maps';
import countries from 'i18n-iso-countries';
import { MouseEvent, useContext, useEffect, useMemo, useRef } from 'react';

import { ChartCoreProps, ChartData, ChartValueField } from '@ts/ui/charts-data';

import { isHTMLElement } from '@lib/type-guards';

import { ChartContext } from '@store/ChartProvider';

import { hideTooltip, updateMapTooltipPos } from './ChartTooltip';
import { ChartClasses } from './chart-styles';
import WorldData from './world-low-res.json';

/**
 * @param props
 * @param props.data - Chart data to visualize.
 * @returns Chart with world map that highlights countries from given data. It does not use chart.js.
 */
export default function MapChart<
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
>({ data }: ChartCoreProps<DataType, ValueKey>) {
  const { updateTooltip, tooltipRef, tooltipProps } = useContext(ChartContext);

  //Maps countries ISO alpha-2 codes with country chart data.
  const countriesMap = useMemo(
    () =>
      new Map(
        data.map((entry) => [
          countries.numericToAlpha2(entry.id)?.toLocaleLowerCase() ?? '',
          entry
        ])
      ),
    [data]
  );

  const mapRef = useRef<HTMLDivElement>(null);

  /**
   * Updates and shows tooltip when entering the country.
   * @param evt
   */
  const onMouseEnter = (evt: MouseEvent<SVGPathElement>) => {
    updateMapTooltipPos(
      tooltipRef,
      mapRef,
      evt.currentTarget,
      updateTooltip,
      countriesMap,
      'center',
      'center',
      tooltipProps.enableTransition
    );
  };

  /**
   * Hides tooltip when leaving the country.
   */
  const onMouseLeave = () => {
    hideTooltip(tooltipRef);
  };

  //Sets country code as id and rank to all path elements of countries that were included in chart data.
  //It helps to identify them on tooltip update.
  useEffect(() => {
    if (mapRef.current) {
      const paths = mapRef.current.querySelectorAll('[aria-checked="true"]');

      for (const path of paths) {
        const country = countriesMap.get(path.id);
        if (isHTMLElement(path) && country !== undefined) {
          path.dataset.rank = country.index.toString();
          path.dataset.item = path.id;
        }
      }
    }
  }, [mapRef, countriesMap]);

  return (
    <div className={ChartClasses.map.core} ref={mapRef}>
      <VectorMap
        className='map'
        {...WorldData}
        layerProps={{
          strokeWidth: 0.5,
          onMouseEnter,
          onMouseLeave
        }}
        checkedLayers={countriesMap.keys().toArray()}
      />
    </div>
  );
}
