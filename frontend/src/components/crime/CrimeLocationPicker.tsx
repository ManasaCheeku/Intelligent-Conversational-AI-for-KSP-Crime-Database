import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import type { LatLngLiteral } from "leaflet";
import L from 'leaflet';

// Fix for default marker icon
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

interface Props { value: LatLngLiteral; onChange: (point: LatLngLiteral) => void; }
function LocationEvents({ onChange }: { onChange: (point: LatLngLiteral) => void }) { useMapEvents({ click: (event) => onChange(event.latlng) }); return null; }
export function CrimeLocationPicker({ value, onChange }: Props) { return <div className="map-picker h-80 w-full"><MapContainer center={value} zoom={12} scrollWheelZoom style={{ height: "100%", width: "100%" }}><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><LocationEvents onChange={onChange} /><Marker position={value} /></MapContainer><p>Click the map to set the incident location.</p></div>; }
