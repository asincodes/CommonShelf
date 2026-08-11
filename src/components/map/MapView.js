'use client';
import React, { useState, useEffect } from 'react';

export default function MapView({ tools = [], onSelectTool }) {
  const [MapComponents, setMapComponents] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

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
      });
    });
  }, []);

  if (!MapComponents) {
    return (
      <div className="w-full h-full min-h-[400px] bg-slate-100 flex items-center justify-center text-slate-500 font-medium">
        Loading Map...
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, useMap } = MapComponents;
  const defaultCenter = [12.9716, 77.5946];

  function LocateControl() {
    const map = useMap();

    const handleLocate = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const coords = [latitude, longitude];
            setUserLocation(coords);
            map.flyTo(coords, 14, { animate: true });
          },
          (error) => {
            alert('Unable to retrieve your location. Please check browser permissions.');
          }
        );
      } else {
        alert('Geolocation is not supported by your browser.');
      }
    };

    return (
      <div className="leaflet-top leaflet-right" style={{ marginTop: '10px', marginRight: '10px', zIndex: 1000 }}>
        <div className="leaflet-control">
          <button
            type="button"
            onClick={handleLocate}
            className="bg-white hover:bg-slate-50 text-slate-800 font-semibold px-3 py-2 rounded-xl shadow-md border border-slate-200 text-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            🎯 Locate Me
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] relative">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full rounded-2xl z-0"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocateControl />

        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="text-center font-bold text-xs text-emerald-700">
                📍 You are here
              </div>
            </Popup>
          </Marker>
        )}

        {tools.map((tool) => {
          if (!tool.lat || !tool.lng) return null;
          return (
            <Marker key={tool._id || tool.id} position={[tool.lat, tool.lng]}>
              <Popup>
                <div className="p-1 text-center">
                  <h4 className="font-bold text-slate-800 text-sm">{tool.title}</h4>
                  <p className="text-xs text-slate-500 mb-2">₹{tool.deposit} Deposit</p>
                  <button
                    type="button"
                    onClick={() => onSelectTool && onSelectTool(tool)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1 rounded-lg font-medium cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}