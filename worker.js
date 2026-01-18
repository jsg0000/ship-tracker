export default {
  async fetch(request, env, ctx) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ship Tracker Pro</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
        :root {
            --primary-color: #0066cc;
            --secondary-color: #ff6b35;
            --dark-bg: #1a1a2e;
            --light-bg: #f8f9fa;
        }

        body {
            background-color: var(--light-bg);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .navbar {
            background: linear-gradient(135deg, #0066cc 0%, #004999 100%);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .navbar-brand {
            font-weight: 700;
            font-size: 1.5rem;
            letter-spacing: 1px;
        }

        .hero-section {
            background: linear-gradient(135deg, #0066cc 0%, #004999 100%);
            color: white;
            padding: 3rem 0;
            margin-bottom: 2rem;
        }

        .hero-section h1 {
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .tracking-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            padding: 2rem;
            margin-bottom: 2rem;
        }

        .example-ships {
            background: #e3f2fd;
            border-radius: 10px;
            padding: 1rem;
            margin-top: 1rem;
        }

        .example-ship-badge {
            background: white;
            border: 2px solid var(--primary-color);
            border-radius: 20px;
            padding: 0.5rem 1rem;
            margin: 0.25rem;
            display: inline-block;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 0.9rem;
        }

        .example-ship-badge:hover {
            background: var(--primary-color);
            color: white;
            transform: translateY(-2px);
        }

        #map {
            height: 500px;
            border-radius: 15px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            margin-top: 2rem;
        }

        .ship-info-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            padding: 2rem;
            margin-top: 2rem;
        }

        .info-row {
            padding: 1rem 0;
            border-bottom: 1px solid #e0e0e0;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-label {
            font-weight: 600;
            color: #666;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .info-value {
            font-size: 1.1rem;
            color: #1a1a2e;
            font-weight: 500;
        }

        .btn-track {
            background: linear-gradient(135deg, var(--primary-color) 0%, #004999 100%);
            border: none;
            padding: 12px 40px;
            font-weight: 600;
            letter-spacing: 1px;
            transition: all 0.3s;
        }

        .btn-track:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,102,204,0.3);
        }

        .loading-spinner {
            text-align: center;
            padding: 2rem;
        }

        .alert-custom {
            border-radius: 10px;
            border-left: 4px solid var(--secondary-color);
        }

        .status-badge {
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
        }

        .status-active {
            background: #d4edda;
            color: #155724;
        }

        .status-port {
            background: #fff3cd;
            color: #856404;
        }

        footer {
            background: var(--dark-bg);
            color: white;
            padding: 2rem 0;
            margin-top: 4rem;
        }

        .ship-marker-icon {
            font-size: 24px;
            color: var(--secondary-color);
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

    <script type="text/babel">
        const { useState, useEffect, useRef } = React;

        // Layout Component
        function Layout({ children }) {
            return (
                <>
                    <nav className="navbar navbar-dark navbar-expand-lg">
                        <div className="container">
                            <a className="navbar-brand" href="#">
                                <i className="fas fa-ship me-2"></i>
                                Ship Tracker Pro
                            </a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <a className="nav-link" href="#"><i className="fas fa-home me-1"></i> Home</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#"><i className="fas fa-info-circle me-1"></i> About</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    
                    <main>
                        {children}
                    </main>

                    <footer>
                        <div className="container text-center">
                            <p className="mb-0">
                                <i className="fas fa-anchor me-2"></i>
                                Ship Tracker Pro &copy; 2026 | Real-time vessel tracking worldwide
                            </p>
                            <small><a href="https://reportone.uk" title="ReportOne Network Tools App">ReportOne Network Tools App</a></small>
                        </div>
                    </footer>
                </>
            );
        }

        // Tracking Page Component
        function TrackingPage() {
            const [shipName, setShipName] = useState('');
            const [loading, setLoading] = useState(false);
            const [shipData, setShipData] = useState(null);
            const [error, setError] = useState(null);
            const mapRef = useRef(null);
            const mapInstanceRef = useRef(null);
            const markerRef = useRef(null);

            // Example ship names
            const exampleShips = [
                'MAERSK ESSEX',
                'MSC GULSUN',
                'EVER GIVEN',
                'CMA CGM ANTOINE DE SAINT EXUPERY',
                'COSCO SHIPPING UNIVERSE',
                'OOCL HONG KONG',
                'MADRID MAERSK',
                'MSC OSCAR',
                'MAERSK MC-KINNEY MOLLER',
                'EMMA MAERSK'
            ];

            // Initialize map
            useEffect(() => {
                if (!mapInstanceRef.current && mapRef.current) {
                    mapInstanceRef.current = L.map(mapRef.current).setView([20, 0], 2);
                    
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(mapInstanceRef.current);
                }
            }, []);

            // Update map when ship data changes
            useEffect(() => {
                if (shipData && mapInstanceRef.current) {
                    const { latitude, longitude } = shipData;
                    
                    // Remove old marker
                    if (markerRef.current) {
                        mapInstanceRef.current.removeLayer(markerRef.current);
                    }

                    // Create custom icon
                    const shipIcon = L.divIcon({
                        className: 'custom-ship-marker',
                        html: '<i class="fas fa-ship ship-marker-icon"></i>',
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
                    });

                    // Add new marker
                    markerRef.current = L.marker([latitude, longitude], { icon: shipIcon })
                        .addTo(mapInstanceRef.current)
                        .bindPopup(\`
                            <div style="text-align: center;">
                                <h6><strong>\${shipData.name}</strong></h6>
                                <p class="mb-1">Type: \${shipData.type}</p>
                                <p class="mb-0">Flag: \${shipData.flag}</p>
                            </div>
                        \`);

                    // Center map on ship
                    mapInstanceRef.current.setView([latitude, longitude], 8);
                }
            }, [shipData]);

            const trackShip = async (name) => {
                setLoading(true);
                setError(null);
                setShipData(null);

                try {
                    // Simulate API call - In production, replace with actual ship tracking API
                    // Example: const response = await fetch(\`https://api.vesselfinder.com/vessels?name=\${name}\`);
                    
                    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

                    // Mock data - Replace this with actual API call
                    const mockData = generateMockShipData(name);
                    
                    setShipData(mockData);
                } catch (err) {
                    setError('Failed to track ship. Please try again.');
                } finally {
                    setLoading(false);
                }
            };

            const generateMockShipData = (name) => {
                // Generate realistic mock data
                const types = ['Container Ship', 'Bulk Carrier', 'Oil Tanker', 'Cargo Ship'];
                const flags = ['Panama', 'Liberia', 'Marshall Islands', 'Hong Kong', 'Singapore', 'Malta'];
                const statuses = ['Underway', 'At Anchor', 'Moored', 'Engaged in Fishing'];
                
                // Generate coordinates based on ship name (pseudo-random but consistent)
                const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const latitude = ((hash % 160) - 80); // -80 to 80
                const longitude = ((hash % 360) - 180); // -180 to 180

                return {
                    name: name,
                    mmsi: 200000000 + (hash % 99999999),
                    imo: 1000000 + (hash % 8999999),
                    type: types[hash % types.length],
                    flag: flags[hash % flags.length],
                    latitude: latitude,
                    longitude: longitude,
                    speed: (hash % 20) + 5,
                    course: hash % 360,
                    status: statuses[hash % statuses.length],
                    length: 200 + (hash % 200),
                    width: 30 + (hash % 20),
                    destination: 'Port of ' + ['Singapore', 'Rotterdam', 'Shanghai', 'Los Angeles', 'Hamburg'][hash % 5],
                    eta: new Date(Date.now() + (hash % 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                };
            };

            const handleSubmit = (e) => {
                e.preventDefault();
                if (shipName.trim()) {
                    trackShip(shipName.trim().toUpperCase());
                }
            };

            const handleExampleClick = (name) => {
                setShipName(name);
                trackShip(name);
            };

            return (
                <>
                    <div className="hero-section">
                        <div className="container text-center">
                            <h1><i className="fas fa-globe me-3"></i>Track Ships Worldwide</h1>
                            <p className="lead">Real-time vessel tracking using AIS data</p>
                        </div>
                    </div>

                    <div className="container">
                        <div className="tracking-card">
                            <h3 className="mb-4"><i className="fas fa-search me-2"></i>Search for a Ship</h3>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-9 mb-3">
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            placeholder="Enter ship name (e.g., MAERSK ESSEX)"
                                            value={shipName}
                                            onChange={(e) => setShipName(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <button type="submit" className="btn btn-primary btn-track btn-lg w-100">
                                            <i className="fas fa-satellite me-2"></i>Track
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="example-ships">
                                <p className="mb-2"><strong><i className="fas fa-star me-2"></i>Try these examples:</strong></p>
                                <div>
                                    {exampleShips.map((ship, index) => (
                                        <span
                                            key={index}
                                            className="example-ship-badge"
                                            onClick={() => handleExampleClick(ship)}
                                        >
                                            {ship}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {loading && (
                            <div className="loading-spinner">
                                <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3"><strong>Searching for vessel...</strong></p>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger alert-custom" role="alert">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                {error}
                            </div>
                        )}

                        {shipData && !loading && (
                            <>
                                <div className="ship-info-card">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h3><i className="fas fa-ship me-2"></i>{shipData.name}</h3>
                                        <span className={\`status-badge \${shipData.status.includes('Underway') ? 'status-active' : 'status-port'}\`}>
                                            {shipData.status}
                                        </span>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="info-row">
                                                <div className="info-label">MMSI</div>
                                                <div className="info-value">{shipData.mmsi}</div>
                                            </div>
                                            <div className="info-row">
                                                <div className="info-label">IMO Number</div>
                                                <div className="info-value">{shipData.imo}</div>
                                            </div>
                                            <div className="info-row">
                                                <div className="info-label">Ship Type</div>
                                                <div className="info-value">{shipData.type}</div>
                                            </div>
                                            <div className="info-row">
                                                <div className="info-label">Flag</div>
                                                <div className="info-value">{shipData.flag}</div>
                                            </div>
                                            <div className="info-row">
                                                <div className="info-label">Dimensions</div>
                                                <div className="info-value">{shipData.length}m × {shipData.width}m</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="info-row">
                                                <div className="info-label">Latitude</div>
                                                <div className="info-value">{shipData.latitude.toFixed(4)}°</div>
                                            </div>
                                            <div className="info-row">
                                                <div className="info-label">Longitude</div>
                                                <div className="info-value">{shipData.longitude.toFixed(4)}°</div>
                                            </div>
                                            <div className="info-row">
                                                <div className="info-label">Speed</div>
                                                <div className="info-value">{shipData.speed} knots</div>
                                            </div>
                                            <div className="info-row">
                                                <div className="info-label">Course</div>
                                                <div className="info-value">{shipData.course}°</div>
                                            </div>
                                            <div className="info-row">
                                                <div className="info-label">Destination</div>
                                                <div className="info-value">{shipData.destination}</div>
                                            </div>
                                            <div className="info-row">
                                                <div className="info-label">ETA</div>
                                                <div className="info-value">{shipData.eta}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div ref={mapRef} id="map"></div>
                            </>
                        )}
                    </div>
                </>
            );
        }

        // Main App Component
        function App() {
            return (
                <Layout>
                    <TrackingPage />
                </Layout>
            );
        }

        // Render App
        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    });
  },
};
