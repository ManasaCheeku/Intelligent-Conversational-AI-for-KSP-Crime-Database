import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import type { LatLngLiteral } from "leaflet";
interface Props { value: LatLngLiteral; onChange: (point: LatLngLiteral) => void; }
function LocationEvents({ onChange }: { onChange: (point: LatLngLiteral) => void }) { useMapEvents({ click: (event) => onChange(event.latlng) }); return null; }
export function CrimeLocationPicker({ value, onChange }: Props) { return <div className="map-picker"><MapContainer center={value} zoom={12} scrollWheelZoom><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><LocationEvents onChange={onChange} /><Marker position={value} /></MapContainer><p>Click the map to set the incident location.</p></div>; }
