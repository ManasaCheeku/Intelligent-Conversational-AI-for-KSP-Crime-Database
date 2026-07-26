import React from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import { Feature, Geometry } from 'geojson';
import { Layer, PathOptions } from 'leaflet';

interface DistrictBoundariesLayerProps {
  // Using 'any' for GeoJSON data type is common for simplicity,
  // but you can use stricter types from '@types/geojson' if needed.
  geoJsonData: any;
}

/**
 * A reusable component that renders GeoJSON data as a layer on a Leaflet map.
 * It applies styling to the boundaries and adds an interactive popup on click.
 */
const DistrictBoundariesLayer: React.FC<DistrictBoundariesLayerProps> = ({ geoJsonData }) => {
  // The useMap hook provides access to the Leaflet map instance.
  const map = useMap();

  // Defines the visual style for the district polygons.
  const style = (): PathOptions => ({
    color: '#1f78b4', // A distinct blue for the boundary lines
    weight: 2,
    opacity: 0.7,
    fillColor: '#a6cee3',
    fillOpacity: 0.2,
  });

  // This function is called for each feature in the GeoJSON data.
  // We use it to bind a popup to each district layer.
  const onEachFeature = (feature: Feature<Geometry, any>, layer: Layer) => {
    if (feature.properties && feature.properties.district) {
      // When a district is clicked, a popup with its name will appear.
      layer.bindPopup(feature.properties.district);

      // Add a click event listener to each district layer.
      layer.on({
        click: (e) => {
          // When clicked, fit the map's bounds to the clicked layer's bounds.
          map.fitBounds(e.target.getBounds());
        },
      });
    }
  };

  return <GeoJSON data={geoJsonData} style={style} onEachFeature={onEachFeature} />;
};

export default DistrictBoundariesLayer;