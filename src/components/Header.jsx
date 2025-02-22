import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div>
      <h1 className="title">
        Los Angeles Fire Rescue Resource Allocation
        <Link 
          to="/about" 
          style={{
            position: 'absolute',
            right: '20px',
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: '1.2rem',
            fontWeight: 'normal'
          }}
        >
          About
        </Link>
      </h1>
      <div className="subtitle">Interactive Emergency Response Mapping System</div>
    </div>
  );
};

export default Header; 