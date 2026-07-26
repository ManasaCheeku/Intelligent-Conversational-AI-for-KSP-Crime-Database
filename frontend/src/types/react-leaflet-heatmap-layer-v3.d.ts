declare module 'react-leaflet-heatmap-layer-v3' {
  import { FC } from 'react';
  import { PathOptions } from 'leaflet';

  export interface HeatmapLayerProps extends PathOptions {
    points: any[];
    longitudeExtractor: (point: any) => number;
    latitudeExtractor: (point: any) => number;
    intensityExtractor: (point: any) => number;
    [key: string]: any;
  }

  export const HeatmapLayer: FC<HeatmapLayerProps>;
}