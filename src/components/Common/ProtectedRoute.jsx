import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', background: '#0D1117',
      }}>
        <CircularProgress sx={{ color: '#FF6F00' }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!userRole) {
    return <Navigate to="/role-selection" replace />;
  }

  if (requiredRole && userRole.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
