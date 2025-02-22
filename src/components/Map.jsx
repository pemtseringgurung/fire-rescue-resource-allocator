import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import fireStations from '../assets/fireStations.json';

// Fix for default marker icons
const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const LA_CENTER = [34.0522, -118.2437];

const LA_Map = () => {
  return (
    <MapContainer
      center={LA_CENTER}
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
      
      {fireStations.stations.map(station => (
        <Marker 
          key={station.id} 
          position={station.position}
          icon={icon}
        >
          <Popup>
            <h3>{station.name}</h3>
            <p>{station.description}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LA_Map;