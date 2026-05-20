import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { LocalShipping as LocalShippingIcon, Navigation as NavigationIcon, Phone as PhoneIcon, CheckCircle as CheckCircleIcon, Timer as TimerIcon, TrendingUp as TrendingUpIcon, Map as MapIcon, SignalCellularAlt as SignalCellularAltIcon, BatteryFull as BatteryFullIcon, Thermostat as ThermometerIcon, LocalGasStation as LocalGasStationIcon, AssignmentTurnedIn as AssignmentTurnedInIcon, Mic as MicIcon, MicOff as MicOffIcon } from '@mui/icons-material';
import { trackingService } from '../../services/RealtimeTrackingService';
import { Fab, Tooltip as MuiTooltip } from '@mui/material';

const DriverApp = () => {
  const [myVehicle, setMyVehicle] = useState(null);
  const [assignedDeliveries, setAssignedDeliveries] = useState([]);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [vehicleStats, setVehicleStats] = useState({});
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [statusNotes, setStatusNotes] = useState('');
  const [completedDeliveries, setCompletedDeliveries] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');

  // Voice Command Setup
  const setupVoiceCommands = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Voice commands not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setVoiceCommand(command);
      console.log('Voice Command:', command);

      if (command.includes('complete') || command.includes('finish')) {
        setOpenStatusDialog(true);
      } else if (command.includes('next') || command.includes('delivery')) {
        // Handle next delivery
      }
    };

    return recognition;
  };

  const toggleVoice = () => {
    const recognition = setupVoiceCommands();
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    }
  };

  useEffect(() => {
    trackingService.initialize(false);

    // REAL-TIME GEOLOCATION TRACKING
    let watchId = null;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, heading, speed } = position.coords;
          console.log('Real Location Update:', latitude, longitude);
          
          // Send real location to the tracking service
          trackingService.updateLocation('DRV001', {
            lat: latitude,
            lng: longitude,
            heading: heading || 0,
            speed: speed ? `${Math.round(speed * 3.6)} km/h` : '0 km/h'
          });

          setVehicleStats(prev => ({
            ...prev,
            lat: latitude.toFixed(4),
            lng: longitude.toFixed(4),
            heading: Math.round(heading || 0),
          }));
        },
        (error) => {
          console.error('Geolocation Error:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000
        }
      );
    }

    // Subscribe to tracking updates
    trackingService.subscribe((vehicles) => {
      const driverVehicle = vehicles.find(v => v.id === 'DRV001');
      if (driverVehicle) {
        setMyVehicle(driverVehicle);
        setVehicleStats(prev => ({
          ...prev,
          temperature: driverVehicle.temperature.toFixed(1),
          signal: 4,
          battery: 95,
        }));
      }
    });

    // Mock assigned deliveries
    setAssignedDeliveries([
      {
        id: 'DEL001',
        address: '300 Park Avenue, NYC',
        customer: 'ABC Construction',
        phone: '+1-555-1001',
        product: 'Concrete M20',
        quantity: 25,
        eta: '2:30 PM',
        status: 'in-transit',
        distance: '2.5 km',
        instructions: 'Enter through loading dock at rear',
      },
      {
        id: 'DEL002',
        address: '350 5th Avenue, NYC',
        customer: 'XYZ Builders',
        phone: '+1-555-1002',
        product: 'Concrete M25',
        quantity: 30,
        eta: '3:15 PM',
        status: 'pending',
        distance: '5.2 km',
        instructions: 'Call before arrival',
      },
      {
        id: 'DEL003',
        address: '400 Madison Avenue, NYC',
        customer: 'DEF Projects',
        phone: '+1-555-1003',
        product: 'Asphalt Grade 1',
        quantity: 40,
        eta: '4:00 PM',
        status: 'pending',
        distance: '7.8 km',
        instructions: 'Park in designated area',
      },
    ]);

    setCurrentDelivery(1); // Currently on delivery #1

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      trackingService.disconnect();
    };
  }, []);

  const handleCompleteDelivery = () => {
    if (statusNotes) {
      setCompletedDeliveries(completedDeliveries + 1);
      setOpenStatusDialog(false);
      setStatusNotes('');
      // Move to next delivery
      if (currentDelivery < assignedDeliveries.length) {
        setCurrentDelivery(currentDelivery + 1);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  if (!myVehicle) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading driver app...</Typography>
      </Box>
    );
  }

  const activeDelivery = currentDelivery
    ? assignedDeliveries[currentDelivery - 1]
    : null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ width: '100%', minHeight: '100vh', backgroundColor: '#1a1a1a' }}
    >
      <Box sx={{ p: 2, backgroundColor: 'background.default', minHeight: '100vh', pb: 10 }}>
        {/* Header with Driver Status */}
        <motion.div variants={itemVariants}>
          <Card
            sx={{
              p: 2,
              mb: 2,
              background: 'linear-gradient(135deg, #FFC107 0%, #FFA000 100%)',
              color: '#000',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {myVehicle.driverName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.7)', display: 'block' }}>
                  {myVehicle.id}
                </Typography>
                {myVehicle.isLive && (
                  <Typography variant="caption" sx={{ color: '#fff', backgroundColor: '#4CAF50', px: 1, borderRadius: 1, mt: 0.5, display: 'inline-block' }}>
                    ● LIVE TRACKING ACTIVE
                  </Typography>
                )}
              </Box>
              <Chip label={myVehicle.status.toUpperCase()} sx={{ backgroundColor: '#000', color: '#FFC107' }} />
            </Box>

            {/* Quick Stats */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mt: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(0,0,0,0.7)', mb: 0.5 }}>
                  Speed
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {myVehicle.speed}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(0,0,0,0.7)', mb: 0.5 }}>
                  Fuel
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {myVehicle.fuelLevel.toFixed(0)}%
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(0,0,0,0.7)', mb: 0.5 }}>
                  Temp
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {vehicleStats.temperature}°C
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(0,0,0,0.7)', mb: 0.5 }}>
                  Deliveries
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {completedDeliveries}/{assignedDeliveries.length}
                </Typography>
              </Box>
            </Box>
          </Card>
        </motion.div>

        {/* Current Delivery */}
        {activeDelivery && (
          <motion.div variants={itemVariants}>
            <Card sx={{ p: 2, mb: 2, border: '2px solid #FFC107' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1.5 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFC107' }}>
                    NEXT DELIVERY
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                    {activeDelivery.address}
                  </Typography>
                </Box>
                <Chip
                  icon={<TimerIcon />}
                  label={activeDelivery.eta}
                  sx={{
                    backgroundColor: '#FFC107',
                    color: '#000',
                    fontWeight: 700,
                  }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                {activeDelivery.customer}
              </Typography>

              {/* Distance Progress */}
              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Distance
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {activeDelivery.distance}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={65}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#FFC107' },
                  }}
                />
              </Box>

              {/* Delivery Details */}
              <Box sx={{ backgroundColor: 'rgba(255, 193, 7, 0.05)', p: 1, borderRadius: 1, mb: 1.5 }}>
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>
                  {activeDelivery.product} - {activeDelivery.quantity} tons
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  📝 {activeDelivery.instructions}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<NavigationIcon />}
                    sx={{
                      backgroundColor: '#2196F3',
                      color: '#fff',
                      fontWeight: 700,
                    }}
                  >
                    Navigate
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PhoneIcon />}
                    sx={{
                      backgroundColor: '#4CAF50',
                      color: '#fff',
                      fontWeight: 700,
                    }}
                  >
                    Call
                  </Button>
                </motion.div>
              </Box>
            </Card>
          </motion.div>
        )}

        {/* Completed Alert */}
        {completedDeliveries > 0 && (
          <motion.div variants={itemVariants}>
            <Alert
              severity="success"
              sx={{
                mb: 2,
                backgroundColor: 'rgba(102, 187, 106, 0.1)',
                borderLeft: '4px solid #66BB6A',
              }}
            >
              ✓ {completedDeliveries} delivery{completedDeliveries > 1 ? 'ies' : ''} completed
            </Alert>
          </motion.div>
        )}

        {/* All Deliveries */}
        <motion.div variants={itemVariants}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
            📦 Today's Route ({assignedDeliveries.length} Stops)
          </Typography>

          {assignedDeliveries.map((delivery, index) => (
            <motion.div key={delivery.id} variants={itemVariants} style={{ marginBottom: 12 }}>
              <Card
                sx={{
                  p: 1.5,
                  opacity: index < currentDelivery ? 0.6 : 1,
                  border: index === currentDelivery - 1 ? '2px solid #FFC107' : '1px solid rgba(255, 193, 7, 0.1)',
                  backgroundColor:
                    index < currentDelivery - 1
                      ? 'rgba(102, 187, 106, 0.1)'
                      : index === currentDelivery - 1
                      ? 'rgba(255, 193, 7, 0.05)'
                      : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'start' }}>
                  {/* Stop Number */}
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor:
                        index < currentDelivery - 1
                          ? '#66BB6A'
                          : index === currentDelivery - 1
                          ? '#FFC107'
                          : '#424242',
                      color: index < currentDelivery - 1 ? '#fff' : index === currentDelivery - 1 ? '#000' : '#fff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    {index < currentDelivery - 1 ? '✓' : index + 1}
                  </Avatar>

                  {/* Delivery Info */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 0.5 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {delivery.address}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {delivery.customer}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#FFC107' }}>
                        {delivery.eta}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                      <Chip
                        size="small"
                        label={`${delivery.quantity} tons`}
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                      <Chip
                        size="small"
                        label={delivery.distance}
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Vehicle Status */}
        <motion.div variants={itemVariants} style={{ marginTop: 24 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
            🚚 Vehicle Status
          </Typography>
          <Card sx={{ p: 1.5 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
              <Box sx={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', p: 1, borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  📍 Location
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                  {vehicleStats.lat}, {vehicleStats.lng}
                </Typography>
              </Box>
              <Box sx={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', p: 1, borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  🧭 Heading
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {vehicleStats.heading}°
                </Typography>
              </Box>
              <Box sx={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', p: 1, borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  📡 Signal
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {vehicleStats.signal}/5 Bars
                </Typography>
              </Box>
              <Box sx={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', p: 1, borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  🔋 Battery
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {vehicleStats.battery}%
                </Typography>
              </Box>
            </Box>
          </Card>
        </motion.div>

        {/* Complete Delivery Button */}
        {activeDelivery && (
          <motion.div variants={itemVariants} style={{ marginTop: 24 }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<CheckCircleIcon />}
              onClick={() => setOpenStatusDialog(true)}
              sx={{
                background: 'linear-gradient(135deg, #66BB6A 0%, #2E7D32 100%)',
                color: '#fff',
                fontWeight: 700,
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              Mark Delivery Complete
            </Button>
          </motion.div>
        )}

        {/* Voice Assistant FAB */}
        <Box sx={{ position: 'fixed', bottom: 80, right: 16, zIndex: 1000 }}>
          <MuiTooltip title={isListening ? "Listening..." : "Voice Commands"} placement="left">
            <Fab
              color={isListening ? "error" : "primary"}
              onClick={toggleVoice}
              sx={{
                background: isListening ? '#f44336' : 'linear-gradient(135deg, #FFC107 0%, #FFA000 100%)',
                color: '#000',
                boxShadow: isListening ? '0 0 20px #f44336' : '0 10px 30px rgba(255,193,7,0.3)',
              }}
            >
              {isListening ? <MicOffIcon /> : <MicIcon />}
            </Fab>
          </MuiTooltip>
        </Box>

        {/* Voice Command feedback toast-like alert */}
        {voiceCommand && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', bottom: 140, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}
          >
            <Chip 
              label={`Command: "${voiceCommand}"`} 
              onDelete={() => setVoiceCommand('')}
              sx={{ backgroundColor: 'rgba(255,193,7,0.9)', color: '#000', fontWeight: 700 }} 
            />
          </motion.div>
        )}
      </Box>

      {/* Complete Delivery Dialog */}
      <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Complete Delivery</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Delivery Notes (Required)"
            multiline
            rows={4}
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            fullWidth
            placeholder="Enter delivery notes, any issues, or customer feedback..."
          />
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
            Photos and signature capture would be collected in production environment.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCompleteDelivery}
            disabled={!statusNotes}
            sx={{ backgroundColor: '#66BB6A' }}
          >
            Confirm Complete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default DriverApp;
