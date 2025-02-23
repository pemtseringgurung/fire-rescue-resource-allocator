import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LA_Map from "./components/Map";
import About from "./components/About";
import Header from "./components/Header";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app-container">
            <Header />
            <LA_Map />
          </div>
        } />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;