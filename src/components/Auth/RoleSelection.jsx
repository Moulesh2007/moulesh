import React from 'react';
import {
  Grid, Card, CardActionArea, CardContent,
  Typography, Box, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { AdminPanelSettings, ManageAccounts, LocalShipping, ShoppingCart, ArrowForward } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const roles = [
  {
    id: 'admin',
    title: 'Admin',
    subtitle: 'Full Control',
    icon: <AdminPanelSettings sx={{ fontSize: 48 }} />,
    description: 'User management, system config, full analytics & reports access',
    color: '#FF6F00',
    gradient: 'linear-gradient(135deg, rgba(255,111,0,0.15) 0%, rgba(255,152,0,0.08) 100%)',
    border: 'rgba(255,111,0,0.3)',
    badge: 'Super User',
  },
  {
    id: 'manager',
    title: 'Manager',
    subtitle: 'Operations',
    icon: <ManageAccounts sx={{ fontSize: 48 }} />,
    description: 'Orders, fleet, inventory & team management dashboard',
    color: '#1565C0',
    gradient: 'linear-gradient(135deg, rgba(21,101,192,0.15) 0%, rgba(94,146,243,0.08) 100%)',
    border: 'rgba(21,101,192,0.3)',
    badge: 'Operations',
  },
  {
    id: 'client',
    title: 'Client',
    subtitle: 'Customer Portal',
    icon: <ShoppingCart sx={{ fontSize: 48 }} />,
    description: 'Place orders, track deliveries, view invoices & payment history',
    color: '#2ECC71',
    gradient: 'linear-gradient(135deg, rgba(46,204,113,0.15) 0%, rgba(46,204,113,0.08) 100%)',
    border: 'rgba(46,204,113,0.3)',
    badge: 'Customer',
  },
  {
    id: 'driver',
    title: 'Driver',
    subtitle: 'Field App',
    icon: <LocalShipping sx={{ fontSize: 48 }} />,
    description: 'View assignments, update delivery status & navigation assistance',
    color: '#F39C12',
    gradient: 'linear-gradient(135deg, rgba(243,156,18,0.15) 0%, rgba(243,156,18,0.08) 100%)',
    border: 'rgba(243,156,18,0.3)',
    badge: 'Field',
  },
];

export default function RoleSelection() {
  const { setRole, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [confirmRole, setConfirmRole] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleRoleSelect = (role) => {
    setConfirmRole(role);
    setDialogOpen(true);
  };

  const confirmAndSaveRole = async () => {
    if (!confirmRole) return;
    try {
      setError('');
      await setRole(confirmRole.id);
      setDialogOpen(false);
      // Fetch routing logic based on assigned role dynamically from the backend
      const token = localStorage.getItem('token');
      const routeResponse = await fetch('/api/user/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const routeData = await routeResponse.json();
      navigate(routeData.route || '/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to select role');
      setDialogOpen(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D1117 0%, #161B22 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: { xs: 2, sm: 4 },
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <Box sx={{
        position: 'absolute', top: '10%', left: '5%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,111,0,0.08) 0%, transparent 70%)',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '10%', right: '5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(21,101,192,0.08) 0%, transparent 70%)',
      }} />

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4, zIndex: 1 }}>
        <Box sx={{
          width: 80, height: 80,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mx: 'auto', mb: 2.5,
          filter: 'drop-shadow(0 8px 16px rgba(255,111,0,0.2))',
        }}>
          <img src="/logo.png" alt="R SUNDARAM & CO Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Box>
        <Chip
          label={`Logged in as ${user?.email}`}
          sx={{
            mb: 2, background: 'rgba(255,111,0,0.1)',
            border: '1px solid rgba(255,111,0,0.3)',
            color: '#FF9800', fontWeight: 600,
          }}
        />
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Select Your Role
        </Typography>
        <Typography variant="body1" sx={{ color: '#8B949E', maxWidth: 400 }}>
          Choose the dashboard that matches your position to get started
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 2, background: 'rgba(211, 47, 47, 0.1)', p: 1, borderRadius: 1 }}>
            {error}
          </Typography>
        )}
      </Box>

      {/* Role Cards */}
      <Grid container spacing={3} sx={{ maxWidth: 860, zIndex: 1 }}>
        {roles.map((role, idx) => (
          <Grid item xs={12} sm={6} key={role.id}>
            <Card
              onClick={() => handleRoleSelect(role)}
              sx={{
                background: role.gradient,
                border: `1px solid ${role.border}`,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 20px 60px ${role.color}30`,
                  border: `1px solid ${role.color}`,
                },
                animation: `fadeSlideIn 0.5s ease ${idx * 0.1}s both`,
                '@keyframes fadeSlideIn': {
                  from: { opacity: 0, transform: 'translateY(20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <CardActionArea sx={{ p: 0 }}>
                <CardContent sx={{ p: 3.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{
                      width: 70, height: 70, borderRadius: 3,
                      background: `${role.color}20`,
                      border: `1px solid ${role.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: role.color,
                    }}>
                      {role.icon}
                    </Box>
                    <Chip
                      label={role.badge}
                      size="small"
                      sx={{
                        background: `${role.color}20`,
                        color: role.color,
                        border: `1px solid ${role.color}40`,
                        fontWeight: 700, fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#E6EDF3' }}>
                    {role.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: role.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {role.subtitle}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#8B949E', mt: 1.5, lineHeight: 1.7 }}>
                    {role.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2.5, color: role.color }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Enter Dashboard</Typography>
                    <ArrowForward sx={{ fontSize: 16, ml: 0.5 }} />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="text"
        onClick={() => navigate('/login')}
        sx={{ mt: 4, color: '#8B949E', zIndex: 1, '&:hover': { color: '#E6EDF3' } }}
      >
        ← Back to Login
      </Button>

      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: '#161B22',
            color: '#E6EDF3',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Your Role</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#8B949E' }}>
            Are you sure you want to select <strong>{confirmRole?.title}</strong>? 
            Once you make this selection, you cannot change your role later. Only an Administrator can modify this.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#8B949E' }}>
            Cancel
          </Button>
          <Button 
            onClick={confirmAndSaveRole} 
            variant="contained" 
            sx={{ bgcolor: confirmRole?.color || '#FF6F00', color: 'white', '&:hover': { bgcolor: confirmRole?.color } }}
            autoFocus
          >
            Confirm & Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
