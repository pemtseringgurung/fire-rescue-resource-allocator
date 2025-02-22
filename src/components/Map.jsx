import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";  // Import Leaflet's CSS

const LA_CENTER = [34.0522, -118.2437]; // Los Angeles coordinates

const LA_Map = () => {
  return (
    <MapContainer
      center={LA_CENTER}
      zoom={10}
      scrollWheelZoom={true}
      style={{
        height: "100vh", // Full viewport height
        width: "100%",   // Full width
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors'
      />
    </MapContainer>
  );
};

export default LA_Map;
