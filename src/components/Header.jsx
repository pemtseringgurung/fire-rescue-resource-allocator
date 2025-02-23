import React from 'react';
import { Link } from 'react-router-dom';
import '../styling/Header.css';

const Header = () => {
  return (
    <div className="header">
      <h1 className="title">
        Los Angeles Fire Rescue Resource Allocation
      </h1>
      <div className="nav-buttons">
        <Link to="/about" className="about-button">
          About
        </Link>
      </div>
      <div className="subtitle">Interactive Emergency Response Mapping System</div>
    </div>
  );
};

export default Header;