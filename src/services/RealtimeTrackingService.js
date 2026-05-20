import io from 'socket.io-client';

class RealtimeTrackingService {
  constructor() {
    this.socket = null;
    this.listeners = [];
    this.mockVehicles = [];
    this.mockInterval = null;
  }

  initialize(useWebSocket = false) {
    if (useWebSocket) {
      try {
        this.socket = io('http://localhost:3000', {
          transports: ['websocket', 'polling'],
        });

        this.socket.on('connect', () => {
          console.log('Connected to tracking server');
        });

        this.socket.on('vehicle-update', (data) => {
          this.notifyListeners(data);
        });

        this.socket.on('disconnect', () => {
          console.log('Disconnected from tracking server');
        });
      } catch (err) {
        console.log('WebSocket unavailable, using mock data', err);
        this.startMockTracking();
      }
    } else {
      this.startMockTracking();
    }
  }

  startMockTracking() {
    // Initialize mock vehicles with realistic routes
    this.mockVehicles = [
      {
        id: 'DRV001',
        driverName: 'John Smith',
        driverPhone: '+1-555-0101',
        status: 'in-transit',
        lat: 40.7128,
        lng: -74.0060,
        speed: '45 km/h',
        heading: 90,
        fuelLevel: 85,
        temperature: 32,
        load: '95%',
        destination: '500 Park Avenue, NYC',
        deliveries: 3,
        nextDelivery: '300 Park Avenue',
        eta: '2 mins',
      },
      {
        id: 'DRV002',
        driverName: 'Maria Garcia',
        driverPhone: '+1-555-0102',
        status: 'in-transit',
        lat: 40.7589,
        lng: -73.9851,
        speed: '38 km/h',
        heading: 180,
        fuelLevel: 72,
        temperature: 30,
        load: '85%',
        destination: '400 5th Avenue, NYC',
        deliveries: 5,
        nextDelivery: '350 5th Avenue',
        eta: '5 mins',
      },
      {
        id: 'DRV003',
        driverName: 'Robert Chen',
        driverPhone: '+1-555-0103',
        status: 'idle',
        lat: 40.7614,
        lng: -73.9776,
        speed: '0 km/h',
        heading: 0,
        fuelLevel: 90,
        temperature: 28,
        load: '0%',
        destination: 'Warehouse A',
        deliveries: 0,
        nextDelivery: 'Pending',
        eta: 'N/A',
      },
      {
        id: 'DRV004',
        driverName: 'Sarah Johnson',
        driverPhone: '+1-555-0104',
        status: 'in-transit',
        lat: 40.7505,
        lng: -73.9972,
        speed: '52 km/h',
        heading: 45,
        fuelLevel: 65,
        temperature: 35,
        load: '100%',
        destination: '200 Central Park South',
        deliveries: 8,
        nextDelivery: '180 Central Park South',
        eta: '3 mins',
      },
      {
        id: 'DRV005',
        driverName: 'Michael Brown',
        driverPhone: '+1-555-0105',
        status: 'returning',
        lat: 40.7282,
        lng: -73.7949,
        speed: '60 km/h',
        heading: 270,
        fuelLevel: 50,
        temperature: 32,
        load: '10%',
        destination: 'Warehouse B',
        deliveries: 12,
        nextDelivery: 'Return to base',
        eta: '15 mins',
      },
    ];

    // Start updating mock positions
    this.mockInterval = setInterval(() => {
      this.mockVehicles = this.mockVehicles.map(vehicle => {
        if ((vehicle.status === 'in-transit' || vehicle.status === 'returning') && !vehicle.isLive) {
          // Simulate GPS movement
          const latDelta = (Math.random() - 0.5) * 0.01;
          const lngDelta = (Math.random() - 0.5) * 0.01;
          const speedVariation = Math.random() * 20;

          return {
            ...vehicle,
            lat: vehicle.lat + latDelta,
            lng: vehicle.lng + lngDelta,
            speed: `${Math.max(20, Math.min(70, parseInt(vehicle.speed) + speedVariation - 10))} km/h`,
            heading: (vehicle.heading + (Math.random() - 0.5) * 30 + 360) % 360,
            fuelLevel: Math.max(0, vehicle.fuelLevel - Math.random() * 0.5),
            temperature: 25 + Math.random() * 15,
          };
        }
        return vehicle;
      });

      this.notifyListeners(this.mockVehicles);
    }, 3000); // Update every 3 seconds
  }

  stopMockTracking() {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    // Send initial data
    if (this.mockVehicles.length > 0) {
      callback(this.mockVehicles);
    }
  }

  unsubscribe(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners(data) {
    this.listeners.forEach(listener => listener(data));
  }

  getVehicleLocation(vehicleId) {
    return this.mockVehicles.find(v => v.id === vehicleId);
  }

  getDeliveryRoute(vehicleId, clientId) {
    // Mock route with waypoints
    return [
      { lat: 40.7128, lng: -74.0060 },
      { lat: 40.7250, lng: -74.0050 },
      { lat: 40.7350, lng: -73.9950 },
      { lat: 40.7400, lng: -73.9850 },
      { lat: 40.7450, lng: -73.9750 },
    ];
  }

  updateVehicleStatus(vehicleId, status) {
    const vehicle = this.mockVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      vehicle.status = status;
      this.notifyListeners(this.mockVehicles);
    }
  }

  updateLocation(vehicleId, updates) {
    const vehicle = this.mockVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      Object.assign(vehicle, updates);
      vehicle.isLive = true; // Mark as real tracking
      // If we had a real socket server, we would emit here:
      if (this.socket && this.socket.connected) {
        this.socket.emit('driver-location-update', { vehicleId, ...updates });
      }
      this.notifyListeners(this.mockVehicles);
    }
  }

  disconnect() {
    this.stopMockTracking();
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export const trackingService = new RealtimeTrackingService();
