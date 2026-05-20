import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Link as RouterLink } from 'react-router-dom';

export default function Header() {
  return (
    <AppBar position="sticky" elevation={3} sx={{
      background: 'linear-gradient(90deg, rgba(123,97,255,0.14), rgba(255,111,0,0.12))',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'saturate(150%) blur(6px)'
    }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 42, height: 42,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '50%',
            p: 0.5,
            border: '1px solid rgba(255,255,255,0.08)',
          }} component={RouterLink} to="/dashboard">
            <img src="/logo.png" alt="R.S&CO" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
          <Typography variant="h6" component={RouterLink} to="/dashboard" sx={{
            background: 'linear-gradient(90deg,#FF6F00,#7B61FF)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            textDecoration: 'none',
            fontWeight: 900,
            letterSpacing: '0.02em'
          }}>
            R&S Tracking
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button startIcon={<HomeIcon />} sx={{ color: '#E6EDF3' }} component={RouterLink} to="/dashboard">Home</Button>
          <Button startIcon={<DirectionsCarIcon />} sx={{ color: '#E6EDF3' }} component={RouterLink} to="/fleet">Fleet</Button>
          <Button startIcon={<AssessmentIcon />} sx={{ color: '#E6EDF3' }} component={RouterLink} to="/reports">Reports</Button>
          <Button variant="contained" onClick={() => window.open('/driver.html', '_blank')}
            sx={{ ml: 1, background: 'linear-gradient(135deg,#FF6F00,#7B61FF)', boxShadow: '0 10px 30px rgba(123,97,255,0.18)', '&:hover': { opacity: 0.95 } }}>
            Driver Simulator
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
