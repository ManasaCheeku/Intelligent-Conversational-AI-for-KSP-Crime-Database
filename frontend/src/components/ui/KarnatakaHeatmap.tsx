import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import CrimeHeatmapLayer, { CrimeDataPoint } from './CrimeHeatmapLayer';

import DistrictBoundariesLayer from './DistrictBoundariesLayer';
import karnatakaDistrictsData from '../../assets/karnataka_districts.geojson';

import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import L from 'leaflet';

// --- FIX START ---
// The root cause of the blank map is Leaflet's default icon path issue with bundlers like Vite.
// We must manually import the icons and override Leaflet's default icon prototype
// to point to the correct, bundled image assets.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});
// --- FIX END ---

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
    // Helper function to format a Date object to 'YYYY-MM-DD' string for the input element
    const formatDateForInput = (date: Date): string => date.toISOString().split('T')[0];

    const today = new Date();
    const thirtyDaysAgo = new Date(new Date().setDate(today.getDate() - 30));

    const [crimeData, setCrimeData] = useState<CrimeDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [startDate, setStartDate] = useState<Date>(thirtyDaysAgo);
    const [endDate, setEndDate] = useState<Date>(today);

    useEffect(() => {
        // This function simulates fetching data from an API endpoint.
        const fetchCrimeData = async (start: Date, end: Date) => {
            setIsLoading(true);
            try {
                // In a real application, you would use fetch() or axios here:
                // const apiUrl = `https://api.example.com/crime-data?start=${formatDateForInput(start)}&end=${formatDateForInput(end)}`;
                // const response = await fetch(apiUrl);
                // const data = await response.json();

                console.log(
                    `Simulating API fetch for dates: ${formatDateForInput(start)} to ${formatDateForInput(end)}`
                );

                // For demonstration, we simulate a network delay and use the mock data.
                await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
                const mockApiResponse: CrimeDataPoint[] = [
                    [12.9716, 77.5946, 50], // Bengaluru
                    [12.9791, 77.5913, 45], // Near Bengaluru
                    [15.8497, 74.4977, 30], // Belagavi
                    [12.3052, 76.6552, 40], // Mysuru
                    [15.4589, 75.0078, 25], // Hubballi-Dharwad
                    [17.3334, 76.8343, 20], // Kalaburagi
                    [12.8614, 74.8446, 35], // Mangaluru
                    [13.3409, 77.7219, 15], // Chikkaballapur
                ];
                setCrimeData(mockApiResponse);
            } catch (error) {
                console.error("Failed to fetch crime data:", error);
                // Optionally, set an error state to show a message to the user
            } finally {
                setIsLoading(false);
            }
        };

        fetchCrimeData(startDate, endDate);
    }, [startDate, endDate]); // Re-run the effect when the date range changes.

    return (
        // This parent div is crucial. It defines the area the map will occupy.
        // 'h-screen' makes it take the full viewport height.
        // 'w-full' makes it take the full width.
        <div className="h-screen w-full relative">
            {/* Date Range Filter UI */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white p-3 rounded-lg shadow-lg flex gap-4 items-center">
                <div className="flex flex-col">
                    <label htmlFor="start-date" className="text-sm font-medium text-gray-600">Start Date</label>
                    <input type="date" id="start-date" className="p-1 border border-gray-300 rounded-md" value={formatDateForInput(startDate)} onChange={e => setStartDate(new Date(e.target.value))} />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="end-date" className="text-sm font-medium text-gray-600">End Date</label>
                    <input type="date" id="end-date" className="p-1 border border-gray-300 rounded-md" value={formatDateForInput(endDate)} onChange={e => setEndDate(new Date(e.target.value))} />
                </div>
            </div>

            {isLoading && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-[1000]">
                    <div className="text-white text-2xl font-bold">Loading Crime Data...</div>
                </div>
            )}
            <MapContainer
                center={karnatakaCenter}
                zoom={7}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }} // Map fills the parent div
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Map View">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.Overlay checked name="District Boundaries">
                        {/* Render the district boundaries layer */}
                        <DistrictBoundariesLayer geoJsonData={karnatakaDistrictsData} />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name="Crime Heatmap">
                        {/* Render the heatmap layer with the fetched crime data */}
                        <CrimeHeatmapLayer data={crimeData} />
                    </LayersControl.Overlay>
                </LayersControl>
            </MapContainer>
        </div>
    );
};

export default KarnatakaHeatmap;