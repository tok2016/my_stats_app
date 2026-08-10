'use client';

import { VectorMap } from '@south-paw/react-vector-maps';
import countries from 'i18n-iso-countries';
import { MouseEvent, useContext, useEffect, useMemo, useRef } from 'react';

import { ChartCoreProps, ChartData, ChartValueField } from '@ts/ui/charts-data';

import { ChartContext } from '@store/ChartProvider';

import { hideTooltip, updateMapTooltipPos } from './ChartTooltip';
import { ChartClasses } from './chart-styles';
import WorldData from './world-low-res.json';

const isHTMLElement = (value: unknown): value is HTMLElement =>
  (value as HTMLElement).style !== undefined;

export default function MapChart<
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
>({ data }: ChartCoreProps<DataType, ValueKey>) {
  const { updateTooltip, tooltipRef, tooltipProps } = useContext(ChartContext);

  const countriesMap: Map<string, DataType> = useMemo(
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

  const onMouseLeave = () => {
    hideTooltip(tooltipRef);
  };

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
