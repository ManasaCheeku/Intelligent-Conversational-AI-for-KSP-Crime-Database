import React from 'react';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';

/**
 * Defines the structure for a single data point for the heatmap.
 * The format is an array: [latitude, longitude, intensity].
 */
export type CrimeDataPoint = [number, number, number];

interface CrimeHeatmapLayerProps {
  /**
   * An array of crime data points to be rendered on the heatmap.
   */
  data: CrimeDataPoint[];
}

/**
 * A reusable component that renders a heatmap layer on a Leaflet map.
 * It uses `react-leaflet-heatmap-layer-v3` to visualize the intensity of data points.
 */
const CrimeHeatmapLayer: React.FC<CrimeHeatmapLayerProps> = ({ data }) => {
  // Don't render the layer if there's no data to display.
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <HeatmapLayer
      points={data}
      longitudeExtractor={(point: CrimeDataPoint) => point[1]}
      latitudeExtractor={(point: CrimeDataPoint) => point[0]}
      intensityExtractor={(point: CrimeDataPoint) => point[2]}
      radius={25} // Adjust the radius of each point for better visualization
    />
  );
};

export default CrimeHeatmapLayer;