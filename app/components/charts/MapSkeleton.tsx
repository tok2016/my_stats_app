import { VectorMap } from '@south-paw/react-vector-maps';

import { ChartClasses } from './chart-styles';
import WorldData from './world-low-res.json';

export default function MapSkeleton() {
  return (
    <div className={`chart ${ChartClasses.map.container}`}>
      <div className='chart-legend-content'>
        <div className='chart-core-wrapper'>
          <div className={ChartClasses.map.core}>
            <VectorMap
              className='map'
              {...WorldData}
              layerProps={{
                strokeWidth: 0.5
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
