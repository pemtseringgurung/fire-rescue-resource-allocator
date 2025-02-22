import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import fireStations from '../assets/fireStations.json';
import firestation from "../assets/images/firestation.png";
import fireIcon from "../assets/images/fire.png";  // Add your fire icon image

// Keep your existing fire station icon
const stationIcon = L.icon({
  iconUrl: firestation,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
  shadowUrl: null
});

// Add new wildfire icon
const wildfireIcon = L.icon({
  iconUrl: fireIcon,  // Use a fire/flame icon image
  iconSize: [35, 35],  // Slightly larger than station icons
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
  shadowUrl: null
});

function AddMarkerOnClick() {
  const [markers, setMarkers] = useState([]);

  useMapEvents({
    click(e) {
      const newMarker = {
        id: Date.now(),
        position: [e.latlng.lat, e.latlng.lng],
      };
      setMarkers(current => [...current, newMarker]);
    }
  });

  return markers.map(marker => (
    <Marker 
      key={marker.id}
      position={marker.position}
      icon={wildfireIcon}  // Use the wildfire icon here
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          console.log('Fire Location:', [position.lat, position.lng]);
        },
      }}
    >
      <Popup>
        Wildfire Location <br/>
        {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
      </Popup>
    </Marker>
  ));
}

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