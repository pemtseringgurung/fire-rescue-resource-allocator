import React from 'react';
import { Link } from 'react-router-dom';
import pemImage from '../assets/images/team/pem.png';
import saidamirImage from '../assets/images/team/saidamir.png';
import surajImage from '../assets/images/team/suraj.png';
import yajasImage from '../assets/images/team/yajas.png';
import '../styling/About.css';

const About = () => {
  return (
    <div className="about-container">
      <Link 
        to="/" 
        className="return-link"
      >
        Return to Map
      </Link>

      <div className="about-content">
        <div className="about-header">
          <h1 className="about-title">About This Project</h1>
          <p className="about-description">
            The Los Angeles Fire Rescue Resource Allocator is designed to enhance emergency response planning. This platform provides a comprehensive view of fire station locations, allowing emergency responders to optimize resource allocation effectively. By visualizing coverage areas and response capabilities, we aim to improve the efficiency of emergency services across Los Angeles.
          </p>
          <p className="about-description">
            Our interactive mapping system allows users to simulate emergency scenarios, place markers on the map, and adjust severity indicators. This real-time decision-making tool is crucial for effective resource management during critical situations, ultimately leading to faster response times and better service for the community.
          </p>
        </div>

        <section className="team-section">
          <h2 className="team-title">Meet the Team</h2>
          <div className="team-container">
            <div className="team-member">
              <img src={pemImage} alt="Pem Gurung" className="team-image" />
              <h3>Pem Gurung</h3>
              <p>Year: Junior</p>
              <p>Major: Computer Science</p>
              <p>pgurung26@wooster.edu</p>
            </div>
            <div className="team-member">
              <img src={saidamirImage} alt="Saidamir Osimov" className="team-image" />
              <h3>Saidamir Osimov</h3>
              <p>Year: Sophomore</p>
              <p>Major: Computer Science</p>
              <p>sosimov27@wooster.edu</p>
            </div>
            <div className="team-member">
              <img src={surajImage} alt="Suraj Acharya" className="team-image" />
              <h3>Suraj Acharya</h3>
              <p>Year: Sophomore</p>
              <p>Major: Computer Science and Mathematics</p>
              <p>sacharya27@wooster.edu</p>
            </div>
            <div className="team-member">
              <img src={yajasImage} alt="Yajas Kandel" className="team-image" />
              <h3>Yajas Kandel</h3>
              <p>Year: Sophomore</p>
              <p>Major: Computer Science</p>
              <p>ykandel27@wooster.edu</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;