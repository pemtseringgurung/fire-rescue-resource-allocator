# Los Angeles Fire Rescue Resource Allocation System

An interactive emergency response mapping system that helps visualize and manage fire station locations and emergency incidents across Los Angeles.

## Features

- Interactive map showing all LA fire stations with detailed information
- Ability to add and manage emergency fire incidents
- Draggable fire markers with adjustable sizes
- Grid overlay for precise location reference
- Real-time coordinate display
- Professional emergency services UI theme

## Technical Stack

- React 19
- Leaflet/React-Leaflet for mapping
- Vite for build tooling
- ESLint for code quality

## Project Structure

fire-rescue-resource-allocator/
├── src/
│ ├── assets/
│ │ ├── images/
│ │ │ ├── firestation.png # Fire station icon
│ │ │ └── fire.png # Emergency fire icon
│ │ └── fireStations.json # LA fire stations data
│ ├── components/
│ │ └── Map.jsx # Main map component
│ ├── App.jsx # Root component
│ ├── App.css # Main styling
│ └── index.css # Global styles + grid overlay
├── package.json
└── README.md

## Key Features Implementation

### Map Component (Map.jsx)
- Displays base map using OpenStreetMap
- Renders fire stations from JSON data
- Implements click-to-add fire incidents
- Provides size control for fire markers
- Supports marker dragging

### Styling (App.css)
- Professional emergency services theme
- Gradient header with emergency colors
- Fixed positioning for reliable layout
- Responsive design considerations

### Grid Overlay (index.css)
- 50px grid pattern for reference
- Semi-transparent overlay
- Non-interfering with map interactions

## Installation

1. Clone the repository
2. Install dependencies:
- bash
- npm install


## Usage

- Click anywhere on the map to add a fire incident
- Click on a fire marker to adjust its size using the slider
- Drag markers to update locations
- Click on fire stations to view details

## Development

The project uses Vite for fast development and building. Available commands:
bash
npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build
npm run lint # Run ESLint


## Dependencies

- react ^19.0.0
- react-dom ^19.0.0
- leaflet ^1.9.4
- react-leaflet ^4.2.1

## Dev Dependencies

- vite ^6.1.0
- eslint ^9.19.0
- @vitejs/plugin-react ^4.3.4
- Various ESLint plugins and configurations

## Future Enhancements

- Add real-time data integration
- Implement resource allocation algorithms
- Add response time analysis
- Include more emergency service features
- Add data persistence
- Enhance marker customization options

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

Copyright (c) 2024 [Pem Gurung]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.