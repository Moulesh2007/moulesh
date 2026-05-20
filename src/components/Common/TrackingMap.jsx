import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, Polyline, LoadScript } from '@react-google-maps/api';
import { Box, CircularProgress } from '@mui/material';
import { trackingService } from '../../services/RealtimeTrackingService';
import DirectionsIcon from '@mui/icons-material/Directions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with actual key

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

// Custom marker icons
const getMarkerIcon = (status, role = 'driver') => {
  const baseUrl = 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_';

  if (role === 'delivery') {
    return {
      path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
      fillColor: status === 'in-transit' ? '#FFC107' : status === 'delivered' ? '#66BB6A' : '#FF6F00',
      fillOpacity: 1,
      scale: 1.5,
      strokeColor: '#fff',
      strokeWeight: 2,
    };
  }

  return {
    fillColor: status === 'in-transit' ? '#2196F3' : status === 'idle' ? '#66BB6A' : '#FF9800',
    path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
    scale: 12,
    strokeColor: '#fff',
    strokeWeight: 2,
  };
};

export const TrackingMap = ({ 
  vehicles = [], 
  showRoutes = true, 
  showHeatmap = false,
  selectedVehicleId = null,
  onVehicleSelect = null,
}) => {
  const [activeMarker, setActiveMarker] = useState(null);
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate bounds to fit all vehicles
  const fitBoundsForVehicles = () => {
    if (!mapRef.current || vehicles.length === 0 || !window.google) return;

    const bounds = new window.google.maps.LatLngBounds();
    vehicles.forEach(vehicle => {
      bounds.extend({ lat: vehicle.lat, lng: vehicle.lng });
    });
    mapRef.current.fitBounds(bounds, { padding: 100 });
  };

  useEffect(() => {
    // Initialize tracking service
    trackingService.initialize(false); // Using mock data by default

    // Subscribe to tracking updates
    const handleUpdate = (data) => {
      setIsLoading(false);
    };

    trackingService.subscribe(handleUpdate);

    return () => {
      trackingService.unsubscribe(handleUpdate);
      trackingService.disconnect();
    };
  }, []);

  useEffect(() => {
    fitBoundsForVehicles();
  }, [vehicles]);

  // Mock heatmap layer (visual representation)
  const getHeatmapGradient = () => {
    return [
      '#0000FF',
      '#00FF00',
      '#FFFF00',
      '#FF7F00',
      '#FF0000',
    ];
  };

  return (
    <Box sx={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
      {(isLoading || !vehicles.length) && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0, 
          display: 'flex', justifyContent: 'center', alignItems: 'center', 
          backgroundColor: 'rgba(0,0,0,0.1)',
          zIndex: 1
        }}>
          <CircularProgress />
        </Box>
      )}
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['visualization']}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={13}
          onLoad={(map) => {
            mapRef.current = map;
            fitBoundsForVehicles();
          }}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
            streetViewControl: true,
            styles: [
              {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#616161' }],
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#e9e9e9' }],
              },
            ],
          }}
        >
          {/* Render vehicle markers */}
          {vehicles.map(vehicle => (
            <React.Fragment key={vehicle.id}>
              <Marker
                position={{ lat: vehicle.lat, lng: vehicle.lng }}
                title={`${vehicle.driverName} (${vehicle.status})`}
                icon={getMarkerIcon(vehicle.status)}
                onClick={() => {
                  setActiveMarker(vehicle.id);
                  onVehicleSelect?.(vehicle);
                }}
                animation={vehicle.status === 'in-transit' ? window.google?.maps?.Animation?.BOUNCE : null}
              />

              {/* Info window for selected vehicle */}
              {activeMarker === vehicle.id && (
                <InfoWindow
                  position={{ lat: vehicle.lat, lng: vehicle.lng }}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <Box
                    sx={{
                      color: '#333',
                      fontSize: '12px',
                      maxWidth: '250px',
                      p: 1,
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      {vehicle.driverName}
                    </div>
                    <div>
                      <strong>Status:</strong> {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </div>
                    <div>
                      <strong>Speed:</strong> {vehicle.speed}
                    </div>
                    <div>
                      <strong>Fuel:</strong> {vehicle.fuelLevel.toFixed(1)}%
                    </div>
                    <div>
                      <strong>Temperature:</strong> {vehicle.temperature.toFixed(1)}°C
                    </div>
                    <div>
                      <strong>Load:</strong> {vehicle.load}
                    </div>
                    <div>
                      <strong>Deliveries:</strong> {vehicle.deliveries}
                    </div>
                    <div>
                      <strong>ETA:</strong> {vehicle.eta}
                    </div>
                  </Box>
                </InfoWindow>
              )}

              {/* Render delivery routes */}
              {showRoutes && vehicle.status === 'in-transit' && (
                <Polyline
                  path={[
                    { lat: vehicle.lat, lng: vehicle.lng },
                    { lat: vehicle.lat + 0.02, lng: vehicle.lng + 0.02 },
                    { lat: vehicle.lat + 0.03, lng: vehicle.lng + 0.05 },
                  ]}
                  options={{
                    strokeColor: '#2196F3',
                    strokeOpacity: 0.7,
                    strokeWeight: 3,
                    geodesic: true,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default TrackingMap;
