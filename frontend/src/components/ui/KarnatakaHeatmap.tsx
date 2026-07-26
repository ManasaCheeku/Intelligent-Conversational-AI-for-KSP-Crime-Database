import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS

// Define the geographical center of Karnataka
const karnatakaCenter: [number, number] = [15.3173, 75.7139];

/**
 * KarnatakaHeatmap component renders a full-screen map centered on Karnataka.
 *
 * This component addresses the common rendering issues with react-leaflet:
 * 1.  **CSS Import**: It explicitly imports 'leaflet/dist/leaflet.css' to ensure
 *     the map container and its elements are styled correctly.
 * 2.  **Container Dimensions**: It uses a wrapper div with specific Tailwind CSS
 *     classes ('h-screen w-full') to give the map a defined size, making it
 *     visible. The map itself is set to take up 100% of this container's space.
 * 3.  **Component Structure**: It follows the correct react-leaflet v4 structure,
 *     with `TileLayer` as a direct child of `MapContainer`.
 */
const KarnatakaHeatmap: React.FC = () => {
    return (
        // This parent div is crucial. It defines the area the map will occupy.
        // 'h-screen' makes it take the full viewport height.
        // 'w-full' makes it take the full width.
        <div className="h-screen w-full">
            <MapContainer
                center={karnatakaCenter}
                zoom={7}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }} // Map fills the parent div
            >
                <TileLayer
                    // Standard OpenStreetMap tile URL
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // Attribution is required by OpenStreetMap's terms of service
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {
                    /*
                     * Your GeoJSON or heatmap layer would go here as a child of MapContainer.
                     * For example:
                     * <CrimeHeatmapLayer data={crimeData} />
                     */
                }
            </MapContainer>
        </div>
    );
};

export default KarnatakaHeatmap;