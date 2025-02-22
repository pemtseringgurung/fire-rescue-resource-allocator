import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import fireStations from '../assets/fireStations.json';
import firestation from "../assets/images/firestation.png";
import fireIcon from "../assets/images/fire.png";

const stationIcon = L.icon({
  iconUrl: firestation,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
  shadowUrl: null
});

function AddMarkerOnClick() {
  const [markers, setMarkers] = useState([]);

  const getFireIcon = (size) => L.icon({
    iconUrl: fireIcon,
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size],
    shadowUrl: null
  });

  useMapEvents({
    click(e) {
      const newMarker = {
        id: markers.length + 1,
        position: [e.latlng.lat, e.latlng.lng],
        size: 35  // Default size
      };
      setMarkers(current => [...current, newMarker]);
    }
  });

  const updateMarkerSize = (markerId, newSize) => {
    setMarkers(current =>
      current.map(marker =>
        marker.id === markerId ? { ...marker, size: newSize } : marker
      )
    );
  };

  return markers.map(marker => (
    <Marker 
      key={marker.id}
      position={marker.position}
      icon={getFireIcon(marker.size)}
      draggable={true}
    >
      <Popup>
        <div>
          Fire #{marker.id}<br/>
          <input 
            type="range" 
            min="20" 
            max="100" 
            value={marker.size}
            onChange={(e) => updateMarkerSize(marker.id, Number(e.target.value))}
            style={{
              width: "150px",
              margin: "10px 0"
            }}
          />
          <br/>
          Size: {marker.size}px<br/>
          {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
        </div>
      </Popup>
    </Marker>
  ));
}

// Rest of your LA_Map component stays the same...

const LA_Map = () => {
  return (
    <MapContainer
      center={[34.0522, -118.2437]}
      zoom={11}
      scrollWheelZoom={true}
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors'
      />
      
      {/* Existing fire stations */}
      {fireStations.stations.map(station => (
        <Marker 
          key={station.id} 
          position={station.position}
          icon={stationIcon}
        >
          <Popup>
            <h3>{station.name}</h3>
            <p>{station.description}</p>
          </Popup>
        </Marker>
      ))}

      {/* Add the click-to-add-fire functionality */}
      <AddMarkerOnClick />
    </MapContainer>
  );
};

export default LA_Map;