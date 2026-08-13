'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';

export default function LocationPickerMap({ lat, lng, onChange }) {
  const [MapComponents, setMapComponents] = useState(null);
  const [currentPos, setCurrentPos] = useState({
    lat: Number.isFinite(Number(lat)) ? Number(lat) : 12.9716,
    lng: Number.isFinite(Number(lng)) ? Number(lng) : 77.5946,
  });

  useEffect(() => {
    Promise.all([
      import('react-leaflet'),
      import('leaflet')
    ]).then(([reactLeaflet, L]) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      setMapComponents({
        MapContainer: reactLeaflet.MapContainer,
        TileLayer: reactLeaflet.TileLayer,
        Marker: reactLeaflet.Marker,
        Popup: reactLeaflet.Popup,
        useMap: reactLeaflet.useMap,
        useMapEvents: reactLeaflet.useMapEvents,
      });
    });
  }, []);

  const updatePosition = (newLat, newLng) => {
    const safeLat = Number(newLat.toFixed(6));
    const safeLng = Number(newLng.toFixed(6));
    setCurrentPos({ lat: safeLat, lng: safeLng });
    if (onChange) {
      onChange({ lat: safeLat, lng: safeLng });
    }
  };

  if (!MapComponents) {
    return (
      <div className="w-full h-48 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">
        Loading Map Picker...
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, useMapEvents } = MapComponents;

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        updatePosition(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  function DraggableMarker() {
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const pos = marker.getLatLng();
            updatePosition(pos.lat, pos.lng);
          }
        },
      }),
      []
    );

    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={[currentPos.lat, currentPos.lng]}
        ref={markerRef}
      >
        <Popup>
          <div className="text-center p-1 text-xs">
            <strong>Tool Pickup Point</strong>
            <br />
            Drag or click map to move
          </div>
        </Popup>
      </Marker>
    );
  }

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updatePosition(position.coords.latitude, position.coords.longitude);
        },
        () => {
          alert('Unable to get current location. Please allow browser location access.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">
          📍 Set Location Pin (Click or Drag map)
        </span>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline text-[11px]"
        >
          🎯 Use My GPS Location
        </button>
      </div>

      <div className="h-48 w-full rounded-xl overflow-hidden border border-slate-300 relative shadow-inner">
        <MapContainer
          center={[currentPos.lat, currentPos.lng]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler />
          <DraggableMarker />
        </MapContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
        <span>Selected Pin Coordinates:</span>
        <span className="font-mono font-semibold text-slate-700">
          Lat: {currentPos.lat}, Lng: {currentPos.lng}
        </span>
      </div>
    </div>
  );
}
