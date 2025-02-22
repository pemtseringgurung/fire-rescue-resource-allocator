import React from "react";
import LA_Map from "./components/Map.jsx";
import "./App.css";

const App = () => {
  return (
    <div className="app-container">
      <h1 className="title">Los Angeles Fire Rescue Resource Allocation</h1>
      <div className="subtitle">Interactive Emergency Response Mapping System</div>
      <LA_Map />
    </div>
  );
};

export default App;