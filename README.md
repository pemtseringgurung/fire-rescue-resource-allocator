# Los Angeles Fire Rescue Resource Allocation System

## Overview
An advanced emergency response mapping system designed to help visualize and manage fire station locations and emergency incidents across Los Angeles. This interactive platform assists emergency responders in optimizing resource allocation and response times.

## Key Features
- **Interactive Map Interface**
  - Real-time fire incident placement
  - Draggable fire markers with adjustable intensity
  - Visual representation of fire intensity with circular overlays
  - Fire station locations with detailed information
  - Grid overlay for precise location reference

- **Resource Management**
  - Dynamic resource allocation from fire stations
  - Resource tracking (firefighters, water, firetrucks)
  - Visual connection lines between stations and assigned fires
  - Automated resource optimization algorithm
  - Real-time resource availability tracking

- **Fire Intensity System**
  - Scale of 1-10 with detailed descriptions
  - Visual intensity indicators
  - Real-time intensity adjustments
  - Comprehensive intensity rubric
  - Circular overlays showing affected areas

- **User Interface**
  - Modern emergency services theme
  - Professional header and navigation
  - Informative popups for both fires and stations
  - Clean, intuitive controls
  - About page with team information

## Technical Stack
- React 19
- React Router for navigation
- Leaflet/React-Leaflet for mapping
- Vite for build tooling
- CSS Modules for styling

## Project Structure

fire-rescue-resource-allocator/
├── src/
│ ├── assets/
│ │ ├── images/
│ │ │ ├── firestation.png
│ │ │ ├── fire.png
│ │ │ └── team/
│ │ │ ├── pem.png
│ │ │ ├── saidamir.png
│ │ │ ├── suraj.png
│ │ │ └── yajas.png
│ │ └── fireStations.json
│ ├── components/
│ │ ├── Map.jsx
│ │ ├── Header.jsx
│ │ └── About.jsx
│ ├── utils/
│ │ └── resourceOptimizer.js
│ ├── styling/
│ │ ├── Map.css
│ │ ├── About.css
│ │ └── Header.css
│ ├── App.jsx
│ └── App.css
└── README.md

## Core Components

### Map Component (Map.jsx)
- Main interactive map interface
- Handles fire incident placement and management
- Manages resource allocation visualization
- Implements intensity circle overlays
- Controls marker dragging and popup interactions

### Resource Optimizer (resourceOptimizer.js)
- Implements intelligent resource allocation algorithm
- Considers:
  - Fire intensity levels
  - Station proximity
  - Available resources
  - Current allocations
- Provides optimal resource distribution suggestions
- Prevents resource overallocation

### About Component (About.jsx)
- Team information display
- Project description
- Implementation details
- Navigation controls

### Header Component (Header.jsx)
- Application title
- Navigation menu
- Subtitle display
- Professional styling

## Installation
1. Clone the repository
2. Install dependencies:
bash
npm install

## Usage
- Click on the map to add fire incidents
- Adjust fire intensity using the slider (1-10 scale)
- Click on fire stations to view and manage resources
- Drag markers to update locations
- Use the optimization button to get resource allocation suggestions
- View the About page for team information

## Development Commands
bash
npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build

## Features Implementation Details

### Map Component
The main map component (Map.jsx) handles:
- Fire station rendering
- Fire incident management
- Resource allocation tracking
- Intensity visualization

### Resource Management
- Each fire station has predefined resources
- Resources can be allocated to multiple fires
- Visual feedback through connecting lines
- Real-time resource tracking

### Fire Intensity Scale
1. Very Low (0.1-1): Small fires, <1 acre
2. Low (1-2): Contained fires, 1-5 acres
3. Moderate (2-3): Spreading fires, 5-10 acres
4. Significant (3-4): Rapid spread, 10-20 acres
5. High (4-5): Large fires, 20-50 acres
6. Very High (5-6): Major events, 50-100 acres
7. Severe (6-7): Extensive fires, 100-200 acres
8. Critical (7-8): Catastrophic, >200 acres
9. Extreme (8-9): Uncontrolled, thousands of acres
10. Catastrophic (9-10): Widespread devastation

## Resource Management
Each fire station manages:
- Firefighters (personnel count)
- Water (gallons)
- Firetrucks (vehicle count)

Resources can be:
- Allocated to multiple fires
- Tracked in real-time
- Optimized automatically
- Visualized through connection lines

## Styling
The application uses a professional emergency services theme:
- Red and black color scheme
- Modern typography
- Responsive design
- Clear visual hierarchy
- Professional animations
- Intuitive controls

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## Team
- Pem Gurung
- Saidamir
- Suraj
- Yajas

## License
MIT License - See LICENSE file for details

## Future Enhancements
- Real-time data integration
- Advanced resource allocation algorithms
- Response time analysis
- Enhanced marker customization
- Data persistence
- Mobile responsiveness improvements
- Weather integration
- Historical data analysis
- Multi-agency coordination
- Advanced reporting features

