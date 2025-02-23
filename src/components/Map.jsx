import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styling/Map.css";
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
  const [intensityDescriptions, setIntensityDescriptions] = useState(Array(10).fill(""));
  const [activePopup, setActivePopup] = useState(null);

  const californiaBounds = [
    [42.0095, -114.8489], // Northeast corner
    [32.5343, -124.4096]  // Southwest corner
  ];

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

  const updateFireIntensity = (fireId, value) => {
    setFires((prevFires) => 
      prevFires.map(fire => 
        fire.id === fireId ? { ...fire, intensity: parseFloat(value) } : fire
      )
    );
  };

  const IntensityCircle = ({ fire }) => {
    const map = useMap();
    const radius = (fire.intensity || 1) * 500; 

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

  const handleDeleteFire = (fireId, e) => {
    e.stopPropagation();
    removeFire(fireId);
    if (activePopup === fireId) {
      setActivePopup(null);
    }
  };

  const handleBack = (e) => {
    e.stopPropagation();
    setActivePopup(null);
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
        setActivePopup(newFire.id);
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
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  setActivePopup(fire.id);
                },
              }}
            >
              <Popup 
                closeButton={false} 
                open={activePopup === fire.id}
              >
                <div className="popup-header">
                  <button 
                    className="back-button" 
                    onClick={handleBack}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', lineHeight: '1' }}
                  >
                    ←
                  </button>
                  <span 
                    className="delete-icon" 
                    onClick={(e) => handleDeleteFire(fire.id, e)}
                    style={{ color: 'red', cursor: 'pointer', marginLeft: '10px', fontSize: '1.5rem', lineHeight: '1' }}
                  >
                    ✖
                  </span>
                </div>
                <div className="intensity-scale">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Fire #{fire.id}</span>
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
                      style={{ cursor: 'pointer' }}
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
                      e.target.setStyle({ weight: 4 });
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

  const handleInputChange = (index, value) => {
    const newDescriptions = [...intensityDescriptions];
    newDescriptions[index] = value;
    setIntensityDescriptions(newDescriptions);
  };

  return (
    <div className="map-container">
      <div className="info-box">
        <h4 className="info-title">Fire Intensity Rubric</h4>
        <ul className="intensity-list">
          <li className="intensity-item"><strong>0.1-1</strong>: Very Low Intensity - Small fire; minimal impact; less than 1 acre affected.</li>
          <li className="intensity-item"><strong>1-2</strong>: Low Intensity - Small, contained fire; 1 to 5 acres affected.</li>
          <li className="intensity-item"><strong>2-3</strong>: Moderate Intensity - Fire spreading; 5 to 10 acres affected.</li>
          <li className="intensity-item"><strong>3-4</strong>: Significant Intensity - Fire is spreading rapidly; 10 to 20 acres affected.</li>
          <li className="intensity-item"><strong>4-5</strong>: High Intensity - Large fire; 20 to 50 acres affected.</li>
          <li className="intensity-item"><strong>5-6</strong>: Very High Intensity - Major fire event; 50 to 100 acres affected.</li>
          <li className="intensity-item"><strong>6-7</strong>: Severe Intensity - Extensive fire; 100 to 200 acres affected.</li>
          <li className="intensity-item"><strong>7-8</strong>: Critical Intensity - Catastrophic fire; over 200 acres affected.</li>
          <li className="intensity-item"><strong>8-9</strong>: Extreme Intensity - Uncontrolled fire; thousands of acres affected.</li>
          <li className="intensity-item"><strong>9-10</strong>: Catastrophic Event - Widespread devastation; thousands of acres affected.</li>
        </ul>
      </div>

      <MapContainer
        center={[34.0522, -118.2437]} // Center on Los Angeles
        zoom={11} // Initial zoom level for Los Angeles
        scrollWheelZoom={true}
        style={{
          height: "calc(100% - 160px)",
          width: "100%",
        }}
        bounds={californiaBounds}
        maxBounds={californiaBounds}
        maxBoundsVisibilty={true}
        minZoom={6}
        maxZoom={15}
        zoomControl={false}
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
                        <label>Water:</label>
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
                        <label>Firetrucks:</label>
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
      <button 
        onClick={handleOptimizeResources}
        className="optimize-button"
      >
        Optimize Resources
      </button>
    </div>
  );
};

export default LA_Map;