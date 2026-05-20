import React from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Paper, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import { Home, ShoppingCart, LocalShipping, Assessment, Person, Logout } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const getNavValue = () => {
    const p = location.pathname;
    if (p === '/dashboard') return 'dashboard';
    if (p === '/orders') return 'orders';
    if (p === '/fleet') return 'fleet';
    if (p === '/inventory') return 'inventory';
    if (p === '/reports') return 'reports';
    return 'dashboard';
  };

  const handleNavChange = (_, v) => {
    navigate({ dashboard: '/dashboard', orders: '/orders', fleet: '/fleet', inventory: '/inventory', reports: '/reports' }[v] || '/dashboard');
  };

  return (
    <Paper sx={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 0,
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <BottomNavigation value={getNavValue()} onChange={handleNavChange} sx={{
          flex: 1, background: 'transparent', height: 64,
          '& .MuiBottomNavigationAction-root': {
            color: '#8B949E', minWidth: 60, py: 1,
            '&.Mui-selected': { color: '#FF6F00' },
            '& .MuiBottomNavigationAction-label': { fontSize: '0.65rem', fontWeight: 600, mt: 0.3, '&.Mui-selected': { fontSize: '0.65rem' } },
          },
        }}>
          <BottomNavigationAction label="Home" value="dashboard" icon={<Home />} />
          <BottomNavigationAction label="Orders" value="orders" icon={<ShoppingCart />} />
          <BottomNavigationAction label="Fleet" value="fleet" icon={<LocalShipping />} />
          <BottomNavigationAction label="Reports" value="reports" icon={<Assessment />} />
        </BottomNavigation>

        <Box sx={{ pr: 2 }}>
          <Avatar
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              width: 36, height: 36, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700,
              background: 'linear-gradient(135deg, #FF6F00 0%, #7B61FF 100%)',
              border: '2px solid rgba(123,97,255,0.22)',
              transition: 'all 0.22s ease', '&:hover': { boxShadow: '0 6px 20px rgba(123,97,255,0.18)' },
            }}
          >
            {user?.email?.charAt(0).toUpperCase()}
          </Avatar>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            PaperProps={{ sx: { borderRadius: 2, mt: -1 } }}
          >
            <MenuItem disabled sx={{ opacity: 1 }}>
              <Person sx={{ mr: 1, fontSize: 18, color: '#FF6F00' }} />
              <Box>
                <Box sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{user?.email?.split('@')[0]}</Box>
                <Box sx={{ fontSize: '0.7rem', color: '#8B949E' }}>{user?.email}</Box>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { logout(); navigate('/login'); }}>
              <Logout sx={{ mr: 1, fontSize: 18, color: '#E74C3C' }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Paper>
  );
}
