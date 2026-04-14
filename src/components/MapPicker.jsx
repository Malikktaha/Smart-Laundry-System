'use client';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) { setPosition(e.latlng); },
  });
  return position === null ? null : <Marker position={position} icon={customIcon} />;
}

export default function MapPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  
  return (
    <div className="flex flex-col gap-4">
      <div className="h-64 w-full rounded border">
        <MapContainer center={[31.5204, 74.3587]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>
      <button 
        onClick={() => onLocationSelect(position)}
        disabled={!position}
        className="bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
      >
        Confirm Location
      </button>
    </div>
  );
}