import React from 'react';
import { Link } from 'react-router-dom';
// Import your team member images
import pemImage from '../assets/images/team/pem.png';  // Add your actual image paths
import saidamirImage from '../assets/images/team/saidamir.png';
import surajImage from '../assets/images/team/suraj.png';
import yajasImage from '../assets/images/team/yajas.png';  // Updated image name

const About = () => {
  return (
    <div style={{
      height: '100vh',
      color: 'white',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'  // Prevents scrollbar
    }}>
      <Link 
        to="/" 
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '12px 24px',
          backgroundColor: '#ff3333',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontSize: '20px',
          zIndex: 1000
        }}
      >
        Return to Map
      </Link>

      <div style={{
        backgroundColor: '#1a1a1a',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <h1 style={{ 
            color: '#ff3333', 
            marginBottom: '30px',  // Increased margin
            fontSize: '36px',
            marginTop: '20px'  // Added top margin
          }}>About This Project</h1>
        </div>
        
        <section style={{ marginBottom: '40px' }}>  
          <p style={{ 
            fontSize: '20px',
            maxWidth: '1200px',
            margin: '0 auto 25px'  // Increased margin
          }}>
            Welcome to the Los Angeles Fire Rescue Resource Allocator, an innovative solution 
            designed to revolutionize emergency response planning in Los Angeles. Our platform 
            provides emergency responders and planners with a powerful tool to visualize and 
            optimize resource allocation across the city's diverse neighborhoods.
          </p>
          <p style={{ 
            fontSize: '20px',
            maxWidth: '1200px',
            margin: '0 auto 25px'  // Increased margin
          }}>
            This interactive mapping system displays all 106 fire stations across Los Angeles,
            allowing emergency planners to better understand coverage areas and response capabilities.
            Users can simulate emergency scenarios by placing markers on the map, with adjustable
            severity indicators to represent different types of incidents. The platform enables
            real-time decision making and resource management during critical situations.
          </p>
          <p style={{ 
            fontSize: '20px',
            maxWidth: '1200px',
            margin: '0 auto 25px'  // Increased margin
          }}>
            The system's real-time visualization capabilities help identify potential gaps in coverage
            and optimize resource deployment, ultimately leading to faster response times and better
            emergency service for Los Angeles residents. By leveraging modern mapping technology
            and intuitive user interfaces, we aim to enhance the efficiency of emergency response
            operations throughout the city.
          </p>
        </section>

        <section style={{ flex: 1 }}>
          <h2 style={{ fontSize: '30px', marginBottom: '40px' }}>Meet the Team</h2>  
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '50px',  // Increased gap
            padding: '0 60px'  // Increased padding
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '150px', 
                height: '150px', 
                margin: '0 auto 25px',
                borderRadius: '75px',
                overflow: 'hidden'  // This ensures the image stays within the circle
              }}>
                <img 
                  src={pemImage} 
                  alt="Pem Gurung"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'  // This ensures the image covers the circle nicely
                  }}
                />
              </div>
              <h3 style={{ margin: '15px 0', fontSize: '24px' }}>Pem Gurung</h3>
              <p style={{ margin: '10px 0', fontSize: '20px' }}>Major: Computer Science</p>
              <p style={{ margin: '10px 0', fontSize: '20px' }}>Year: Junior</p>
              <p style={{ margin: '10px 0', fontSize: '18px' }}>Email: pgurung26@wooster.edu</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '150px', 
                height: '150px', 
                margin: '0 auto 25px',
                borderRadius: '75px',
                overflow: 'hidden'
              }}>
                <img 
                  src={saidamirImage} 
                  alt="Saidamir Osimov"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <h3 style={{ margin: '15px 0', fontSize: '24px' }}>Saidamir Osimov</h3>
              <p style={{ margin: '10px 0', fontSize: '20px' }}>Major: Computer Science</p>
              <p style={{ margin: '10px 0', fontSize: '20px' }}>Year: Sophomore</p>
              <p style={{ margin: '10px 0', fontSize: '18px' }}>Email: sosimov27@wooster.edu</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '150px', 
                height: '150px', 
                margin: '0 auto 25px',
                borderRadius: '75px',
                overflow: 'hidden'
              }}>
                <img 
                  src={surajImage} 
                  alt="Suraj Acharya"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <h3 style={{ margin: '15px 0', fontSize: '24px' }}>Suraj Acharya</h3>
              <p style={{ margin: '10px 0', fontSize: '20px' }}>Double Major: Computer Science and Mathematics</p>
              <p style={{ margin: '10px 0', fontSize: '20px' }}>Year: Sophomore</p>
              <p style={{ margin: '10px 0', fontSize: '18px' }}>Email: sacharya27@wooster.edu</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '150px', 
                height: '150px', 
                margin: '0 auto 25px',
                borderRadius: '75px',
                overflow: 'hidden'
              }}>
                <img 
                  src={yajasImage} 
                  alt="Yajas Kandel"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <h3 style={{ margin: '15px 0', fontSize: '24px' }}>Yajas Kandel</h3>
              <p style={{ margin: '10px 0', fontSize: '20px' }}>Major: Computer Science</p>
              <p style={{ margin: '10px 0', fontSize: '20px' }}>Year: Sophomore</p>
              <p style={{ margin: '10px 0', fontSize: '18px' }}>Email: ykandel27@wooster.edu</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;