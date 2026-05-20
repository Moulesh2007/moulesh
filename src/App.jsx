import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Box, ThemeProvider } from "@mui/material";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { getThemeByRole } from "./roleThemes";
import Header from './components/Common/Header';

// Auth Components
import LoginPage from "./components/Auth/LoginPage";
import RoleSelection from "./components/Auth/RoleSelection";

// Dashboard Components - Role-Based
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import ManagerDashboard from "./components/Dashboard/ManagerDashboard";
import ClientPortal from "./components/Dashboard/ClientPortal";
import DriverApp from "./components/Dashboard/DriverApp";
import MainDashboard from "./components/Dashboard/MainDashboard";
import OrderManagement from "./components/Orders/OrderManagement";
import FleetTracking from "./components/Fleet/FleetTracking";
import InventoryQuality from "./components/Inventory/InventoryQuality";
import ReportsBilling from "./components/Reports/ReportsBilling";

// Common Components
import BottomNav from "./components/Common/BottomNav";
import ProtectedRoute from "./components/Common/ProtectedRoute";

// Management Components
import WorksPage from "./components/Management/WorksPage";
import RawMaterialsPage from "./components/Management/RawMaterialsPage";
import VehiclesPage from "./components/Management/VehiclesPage";
import DriversPage from "./components/Management/DriversPage";
import UsersManagementPage from "./components/Management/UsersManagementPage";

// Theme Wrapper Component
function ThemedApp() {
  const { userRole } = useAuth();
  const theme = getThemeByRole(userRole);

  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>
  );
}

// Routes Component
function AppRoutes() {
  const location = useLocation();
  const { userRole } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/role-selection" element={<RoleSelection />} />

      {/* Role-Based Dashboard Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <Box sx={{ minHeight: '100vh' }}>
              <Header />
              <AdminDashboard />
            </Box>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager-dashboard"
        element={
          <ProtectedRoute requiredRole="manager">
            <Box sx={{ minHeight: '100vh' }}>
              <Header />
              <ManagerDashboard />
            </Box>
          </ProtectedRoute>
        }
      />

      <Route
        path="/client-portal"
        element={
          <ProtectedRoute requiredRole="client">
            <Box sx={{ minHeight: '100vh' }}>
              <Header />
              <ClientPortal />
            </Box>
          </ProtectedRoute>
        }
      />

      <Route
        path="/driver-app"
        element={
          <ProtectedRoute requiredRole="driver">
            <Box sx={{ minHeight: '100vh' }}>
              <Header />
              <DriverApp />
            </Box>
          </ProtectedRoute>
        }
      />

      {/* Legacy Dashboard Routes (fallback) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Box>
              <Header />
              <Box sx={{ pb: 10 }}>
                {userRole === 'admin' && <AdminDashboard />}
                {userRole === 'manager' && <ManagerDashboard />}
                {userRole === 'client' && <ClientPortal />}
                {userRole === 'driver' && <DriverApp />}
                {!userRole && <MainDashboard />}
              </Box>
              <BottomNav />
            </Box>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Box>
              <Header />
              <Box sx={{ pb: 10 }}>
                <OrderManagement />
              </Box>
              <BottomNav />
            </Box>
          </ProtectedRoute>
        }
      />

      <Route
        path="/fleet"
        element={
          <ProtectedRoute>
            <Box>
              <Header />
              <Box sx={{ pb: 10 }}>
                <FleetTracking />
              </Box>
              <BottomNav />
            </Box>
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <Box>
              <Header />
              <Box sx={{ pb: 10 }}>
                <InventoryQuality />
              </Box>
              <BottomNav />
            </Box>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Box>
              <Header />
              <Box sx={{ pb: 10 }}>
                <ReportsBilling />
              </Box>
              <BottomNav />
            </Box>
          </ProtectedRoute>
        }
      />

      {/* Management Routes */}
      <Route path="/works" element={<ProtectedRoute><Box><Header /><Box sx={{ pb: 10 }}><WorksPage /></Box><BottomNav /></Box></ProtectedRoute>} />
      <Route path="/raw-materials" element={<ProtectedRoute><Box><Header /><Box sx={{ pb: 10 }}><RawMaterialsPage /></Box><BottomNav /></Box></ProtectedRoute>} />
      <Route path="/vehicles" element={<ProtectedRoute><Box><Header /><Box sx={{ pb: 10 }}><VehiclesPage /></Box><BottomNav /></Box></ProtectedRoute>} />
      <Route path="/drivers" element={<ProtectedRoute><Box><Header /><Box sx={{ pb: 10 }}><DriversPage /></Box><BottomNav /></Box></ProtectedRoute>} />
      <Route path="/users-management" element={<ProtectedRoute requiredRole="admin"><Box><Header /><Box sx={{ pb: 10 }}><UsersManagementPage /></Box><BottomNav /></Box></ProtectedRoute>} />

      {/* Default Route - Redirect based on role */}
      <Route path="/" element={<Navigate to={userRole ? `/dashboard` : "/login"} replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </Router>
  );
}

export default App;
