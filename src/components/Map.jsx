import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import L from 'leaflet';
import fireStations from '../assets/fireStations.json';
import firestation from "../assets/images/firestation.png";
import fireIcon from "../assets/images/fire.png";
import { optimizeResources } from '../utils/resourceOptimizer';

const stationIcon = L.icon({
  iconUrl: firestation,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
  shadowUrl: null
});

const LA_Map = () => {
  const [dispatchedResources, setDispatchedResources] = useState({});
  const [fires, setFires] = useState([]);

  const handleResourceDispatch = (stationId, fireId, resources) => {
    setDispatchedResources(prev => ({
      ...prev,
      [stationId]: {
        ...prev[stationId],
        [fireId]: {
          firefighters: resources.firefighters || 0,
          water: resources.water || 0,
          firetrucks: resources.firetrucks || 0
        }
      }
    }));
  };

  const hasDispatchedResources = (stationId, fireId) => {
    const resources = dispatchedResources[stationId]?.[fireId];
    return resources && (
      resources.firefighters > 0 ||
      resources.water > 0 ||
      resources.firetrucks > 0
    );
  };

  const getFireIcon = (size) => L.icon({
    iconUrl: fireIcon,
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size],
    shadowUrl: null
  });

  const updateFireIntensity = (fireId, intensity) => {
    setFires(current => 
      current.map(fire => 
        fire.id === fireId 
          ? { ...fire, intensity: parseFloat(intensity) }
          : fire
      )
    );
  };

  // Component to maintain circle size across zoom levels
  const IntensityCircle = ({ fire }) => {
    const map = useMap();
    const radius = (fire.intensity || 1) * 500; // Base radius in meters

    return (
      <Circle
        center={fire.position}
        radius={radius}
        pathOptions={{
          fillColor: '#ff6b6b',
          fillOpacity: 0.3,
          color: '#ff0000',
          weight: 1
        }}
      />
    );
  };

  const removeFire = (fireId) => {
    setFires(current => current.filter(fire => fire.id !== fireId));
    setDispatchedResources(current => {
      const newDispatch = { ...current };
      Object.keys(newDispatch).forEach(stationId => {
        if (newDispatch[stationId][fireId]) {
          delete newDispatch[stationId][fireId];
        }
      });
      return newDispatch;
    });
  };

  const AddMarkerWithTracking = () => {
    useMapEvents({
      click(e) {
        const newFire = {
          id: fires.length + 1,
          position: [e.latlng.lat, e.latlng.lng],
          size: 35,
          intensity: 1.0
        };
        setFires(current => [...current, newFire]);
      }
    });

    return (
      <>
        {fires.map(fire => (
          <React.Fragment key={fire.id}>
            <IntensityCircle fire={fire} />
            <Marker 
              position={fire.position}
              icon={getFireIcon(fire.size)}
              draggable={true}
            >
              <Popup>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Fire #{fire.id}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();  // Stop event from reaching the map
                        removeFire(fire.id);
                      }}
                      className="remove-fire-btn"
                    >
                      ✕
                    </button>
                  </div>
                  <div>{fire.position[0].toFixed(4)}, {fire.position[1].toFixed(4)}</div>
                  <div className="intensity-slider">
                    <label>Intensity: </label>
                    <input 
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={fire.intensity || 1}
                      onChange={(e) => updateFireIntensity(fire.id, e.target.value)}
                    />
                    <span>{(fire.intensity || 1).toFixed(1)}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
            
            {fireStations.stations.map(station => (
              hasDispatchedResources(station.id, fire.id) && (
                <Polyline
                  key={`${station.id}-${fire.id}`}
                  positions={[station.position, fire.position]}
                  dashArray={[10, 10]}
                  color="red"
                  weight={2}
                  eventHandlers={{
                    mouseover: (e) => {
                      e.target.setStyle({ weight: 8 });
                    },
                    mouseout: (e) => {
                      e.target.setStyle({ weight: 2 });
                    }
                  }}
                  pathOptions={{
                    interactive: true,
                    clickable: true,
                  }}
                >
                  <Popup>
                    <div className="dispatch-popup">
                      <h4>{station.name} → Fire #{fire.id}</h4>
                      <div className="resource-item">
                        <span>Firefighters:</span>
                        <span className="resource-value">
                          {dispatchedResources[station.id]?.[fire.id]?.firefighters || 0}
                        </span>
                      </div>
                      <div className="resource-item">
                        <span>Water:</span>
                        <span className="resource-value">
                          {dispatchedResources[station.id]?.[fire.id]?.water || 0} gallons
                        </span>
                      </div>
                      <div className="resource-item">
                        <span>Firetrucks:</span>
                        <span className="resource-value">
                          {dispatchedResources[station.id]?.[fire.id]?.firetrucks || 0}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Polyline>
              )
            ))}
          </React.Fragment>
        ))}
      </>
    );
  };

  const handleOptimizeResources = () => {
    const optimizedAllocation = optimizeResources(fireStations, fires);
    setDispatchedResources(optimizedAllocation);
  };

  return (
    <>
      <button 
        onClick={handleOptimizeResources}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '10px 20px',
          backgroundColor: '#d32f2f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Optimize Resources
      </button>
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
        
        {fireStations.stations.map(station => (
          <Marker 
            key={station.id} 
            position={station.position}
            icon={stationIcon}
          >
            <Popup>
              <div className="station-popup">
                <h3>{station.name}</h3>
                <p>{station.description}</p>
                <div className="resource-controls">
                  <h4>Dispatched Resources:</h4>
                  {fires.map(fire => (
                    <div key={fire.id} className="fire-resources">
                      <h5>Fire #{fire.id}</h5>
                      <div>
                        <label>Firefighters: </label>
                        <input 
                          type="number" 
                          min="0"
                          value={dispatchedResources[station.id]?.[fire.id]?.firefighters || 0}
                          onChange={(e) => handleResourceDispatch(station.id, fire.id, {
                            ...dispatchedResources[station.id]?.[fire.id],
                            firefighters: parseInt(e.target.value)
                          })}
                        />
                      </div>
                      <div>
                        <label>Water (gallons): </label>
                        <input 
                          type="number"
                          min="0"
                          value={dispatchedResources[station.id]?.[fire.id]?.water || 0}
                          onChange={(e) => handleResourceDispatch(station.id, fire.id, {
                            ...dispatchedResources[station.id]?.[fire.id],
                            water: parseInt(e.target.value)
                          })}
                        />
                      </div>
                      <div>
                        <label>Firetrucks: </label>
                        <input 
                          type="number"
                          min="0"
                          value={dispatchedResources[station.id]?.[fire.id]?.firetrucks || 0}
                          onChange={(e) => handleResourceDispatch(station.id, fire.id, {
                            ...dispatchedResources[station.id]?.[fire.id],
                            firetrucks: parseInt(e.target.value)
                          })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <AddMarkerWithTracking />
      </MapContainer>
    </>
  );
};

export default LA_Map;