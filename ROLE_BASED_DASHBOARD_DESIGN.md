# RS&CO Tracking System - Role-Based Dashboard Design

## Executive Summary

This document outlines a comprehensive role-based dashboard architecture for the RS&CO Tracking System with four distinct user roles: **Admin**, **Manager**, **Driver**, and **Client**. Each role has its own dedicated dashboard with role-specific features, UI components, and access permissions.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Route Structure & RBAC](#route-structure--rbac)
3. [Admin Dashboard](#admin-dashboard)
4. [Manager Dashboard](#manager-dashboard)
5. [Driver Dashboard](#driver-dashboard)
6. [Client Dashboard](#client-dashboard)
7. [Common Components](#common-components)
8. [Security & Access Control](#security--access-control)
9. [Component Structure](#component-structure)
10. [Database Schema Recommendations](#database-schema-recommendations)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    RS&CO Tracking System                     │
├─────────────────────────────────────────────────────────────┤
│                      Authentication Layer                    │
│              (Login → Role Selection → Dashboard)            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┬──────────────┬──────────┬───────────────┐  │
│  │    Admin    │   Manager    │  Driver  │    Client     │  │
│  │  Dashboard  │   Dashboard  │ Dashboard│  Portal       │  │
│  ├─────────────┼──────────────┼──────────┼───────────────┤  │
│  │ Full Access │ Team Control │ Tracking │ Self Service  │  │
│  │ Analytics   │ Assignments  │ Schedule │ Bookings      │  │
│  │ Settings    │ Reports      │ Status   │ History       │  │
│  └─────────────┴──────────────┴──────────┴───────────────┘  │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                 Common Services & Utilities                  │
│         (Auth, API, Notifications, Real-time Updates)       │
└─────────────────────────────────────────────────────────────┘
```

---

## Route Structure & RBAC

### URL Routes by Role

```
PUBLIC ROUTES:
  /login                          - Login page (accessible to all)
  /role-selection                 - Role selection (after login)

ROLE-BASED ROUTES:
  /admin/*                        - Admin dashboard (role: admin only)
  /manager/*                      - Manager dashboard (role: manager only)
  /driver/*                       - Driver dashboard (role: driver only)
  /client/*                       - Client portal (role: client only)

SHARED ROUTES (role-aware):
  /dashboard                      - Main dashboard (redirects based on role)
  /profile                        - User profile (different per role)
  /settings                       - Settings (different per role)
  /help                           - Help page (available to all)
```

### RBAC Implementation Strategy

```javascript
// Access Control Matrix
const ROLE_PERMISSIONS = {
  admin: ['read_all', 'write_all', 'manage_users', 'manage_roles', 'view_analytics', 'manage_settings'],
  manager: ['read_team', 'write_team', 'manage_drivers', 'manage_clients', 'view_team_reports', 'assign_tasks'],
  driver: ['read_own', 'update_status', 'view_schedule', 'view_assignments', 'update_location'],
  client: ['read_own', 'create_bookings', 'view_history', 'view_profile']
};

// Route Protection Logic
const hasPermission = (userRole, requiredPermission) => {
  return ROLE_PERMISSIONS[userRole]?.includes(requiredPermission) || false;
};
```

---

## Admin Dashboard

### Overview
**URL:** `/admin`  
**Access:** Admin role only  
**Purpose:** Complete system oversight, user management, analytics, and configuration

### Key Features

#### 1. **Dashboard Overview (Main Page)**
- System health metrics
- Key performance indicators (KPIs)
- Real-time activity feed
- User statistics

**UI Components:**
```
┌─────────────────────────────────────┐
│        Admin Dashboard              │
├─────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────┐ │
│  │Total RMC │ │ Total    │ │Fleet │ │
│  │ Plants:12│ │ Fleet: 24│ │Active│ │
│  │ Status:OK│ │ Utiliz:  │ │: 22  │ │
│  │          │ │   85%    │ │      │ │
│  └──────────┘ └──────────┘ └──────┘ │
│                                      │
│  Revenue Trend (Chart)   Status Dist │
│  ┌────────────┐          ┌────────┐ │
│  │ Line Chart │          │Pie Chrt│ │
│  │            │          │        │ │
│  │            │          │        │ │
│  └────────────┘          └────────┘ │
│                                      │
│  Recent Activity                    │
│  ┌──────────────────────────────┐  │
│  │ • New Manager Added           │  │
│  │ • Fleet 05 Offline            │  │
│  │ • Delivery Completed          │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

#### 2. **User Management Section**
**URL:** `/admin/users`  
**Features:**
- List all users (Managers, Drivers, Clients)
- Create/Edit/Delete users
- Role assignment
- Activate/Deactivate accounts
- View user activity logs

**UI Components:**
- Data table with filters and search
- User creation modal with form validation
- Bulk action toolbar
- User profile cards

#### 3. **Analytics & Reports**
**URL:** `/admin/analytics`  
**Features:**
- Revenue dashboard
- Fleet utilization reports
- Driver performance metrics
- Plant efficiency analysis
- Custom report builder

**UI Components:**
- Multiple chart types (Line, Bar, Pie, Area)
- Date range picker
- Export to PDF/Excel
- Custom dashboard builder
- Trend indicators with % change

#### 4. **System Settings**
**URL:** `/admin/settings`  
**Features:**
- Global configuration
- API keys management
- Email/SMS templates
- Notification settings
- Backup & recovery
- System maintenance

**UI Components:**
- Settings form groups
- Toggle switches
- Dropdown selectors
- Code editors for templates
- Status indicators

#### 5. **Real-Time Monitoring**
**URL:** `/admin/monitoring`  
**Features:**
- Live fleet tracking map
- Active user sessions
- System performance metrics
- Alert management
- Incident reporting

**UI Components:**
- Interactive map with vehicle markers
- Real-time location updates
- Alert notification panel
- System health gauge
- Session management table

---

## Manager Dashboard

### Overview
**URL:** `/manager`  
**Access:** Manager role only  
**Purpose:** Manage assigned team (drivers, clients), view team performance, assign tasks

### Key Features

#### 1. **Dashboard Overview (Main Page)**
**URL:** `/manager`  
**Components:**
- Team summary (# of drivers, clients, active assignments)
- Today's schedule/assignments
- Team performance KPIs
- Quick action buttons

```
┌─────────────────────────────────────┐
│     Manager Dashboard               │
├─────────────────────────────────────┤
│  My Team Stats                      │
│  ┌──────────┐ ┌──────────┐          │
│  │Drivers: 8│ │Clients:15│          │
│  │Active: 7 │ │Active: 12│          │
│  └──────────┘ └──────────┘          │
│                                      │
│  Today's Assignments (5)            │
│  ┌──────────────────────────────┐  │
│  │ Order #2341 - Driver: John D │  │
│  │ Status: In Transit           │  │
│  │ Client: ABC Construction     │  │
│  └──────────────────────────────┘  │
│                                      │
│  Team Performance                   │
│  ┌────────────┐                     │
│  │ Bar Chart  │                     │
│  │ Deliveries│                     │
│  │ by Driver │                     │
│  └────────────┘                     │
└─────────────────────────────────────┘
```

#### 2. **Driver Management**
**URL:** `/manager/drivers`  
**Features:**
- List all assigned drivers
- Driver status (Active, On Break, Offline)
- Performance metrics
- Driver schedule
- Driver profiles & documents
- Assign/Reassign routes

**UI Components:**
- Driver list with status badges
- Driver detail cards
- Schedule calendar view
- Document upload form
- Route assignment modal
- Performance charts

#### 3. **Client Management**
**URL:** `/manager/clients`  
**Features:**
- List all assigned clients
- Client contact information
- Booking history
- Open orders
- Client performance/reliability
- Generate client reports

**UI Components:**
- Client list/table
- Client profile cards
- Booking details
- Communication history
- Contract/SLA management
- Invoice tracker

#### 4. **Assignment & Task Management**
**URL:** `/manager/assignments`  
**Features:**
- Create new assignments
- Assign drivers to routes
- Set priority levels
- Deadline management
- Real-time assignment tracking
- Reassign on the fly

**UI Components:**
- Assignment creation form
- Drag-and-drop route assignment
- Status timeline
- Priority indicator
- Comments/notes section
- Quick reassign dialog

#### 5. **Team Reports**
**URL:** `/manager/reports`  
**Features:**
- Team productivity reports
- Delivery completion rates
- On-time delivery percentage
- Driver performance ranking
- Revenue by driver
- Custom report generation

**UI Components:**
- Report builder interface
- Multiple export formats
- Scheduling report generation
- Date range filters
- Performance trend charts
- KPI comparison widgets

#### 6. **Communications**
**URL:** `/manager/communications`  
**Features:**
- Send messages to drivers
- Broadcast announcements
- View message history
- Two-way chat with team members

**UI Components:**
- Message list
- Chat interface
- Driver selector (single/bulk)
- Message templates
- Read receipts

---

## Driver Dashboard

### Overview
**URL:** `/driver`  
**Access:** Driver role only  
**Purpose:** View personal schedule, track assignments, update status in real-time

### Key Features

#### 1. **Dashboard Overview (Main Page)**
**URL:** `/driver`  
**Components:**
- Current assignment details
- Today's schedule
- Navigation/directions
- Quick status update
- Notifications

```
┌─────────────────────────────────────┐
│     Driver Dashboard                │
├─────────────────────────────────────┤
│  Current Assignment                 │
│  ┌───────────────────────────────┐ │
│  │ Order #2341                    │ │
│  │ Client: ABC Construction       │ │
│  │ Pickup Location: Plant A       │ │
│  │ Delivery: Site B (5 km away)  │ │
│  │ Status: [In Transit] [🎯Nav]   │ │
│  └───────────────────────────────┘ │
│                                      │
│  Today's Schedule                   │
│  ┌──────────────────────────────┐  │
│  │ 08:00 - Pickup (Order #2340)  │  │
│  │ 09:30 - Delivery (Order #2341)│  │
│  │ 11:00 - Pickup (Order #2342)  │  │
│  │ 14:00 - Return to Plant        │  │
│  └──────────────────────────────┘  │
│                                      │
│  Status:                            │
│  [🟢 Available] [⏸ Break] [🔴 Off]  │
│                                      │
│  Earnings Today: $240               │
└─────────────────────────────────────┘
```

#### 2. **Assignment Details**
**URL:** `/driver/assignments`  
**Features:**
- Current assignment details
- Next scheduled assignments
- Pickup/Delivery details
- Customer information
- Navigation/directions
- Proof of delivery (photos, signature)

**UI Components:**
- Current assignment card
- Upcoming assignments list
- Route map integration
- Customer contact card
- Delivery checklist
- Signature capture widget
- Photo upload
- Notes input

#### 3. **Location Tracking & Navigation**
**URL:** `/driver/tracking`  
**Features:**
- Live map with current location
- Route visualization
- Turn-by-turn navigation
- ETA calculation
- Offline map support
- Geofence alerts

**UI Components:**
- Interactive map
- Navigation overlay
- Speed/distance indicator
- Geofence entry/exit alerts
- Toll/road information
- Waypoint marker

#### 4. **Task/Status Management**
**URL:** `/driver/tasks`  
**Features:**
- Mark task as started
- Mark task as completed
- Update task status (Started, In Progress, Completed, Failed)
- Add notes to tasks
- Capture proof of delivery
- Report issues

**UI Components:**
- Task list with status
- Status update buttons
- Notes input field
- Photo/signature capture
- Issue reporting form
- Real-time sync indicator

#### 5. **Personal Schedule**
**URL:** `/driver/schedule`  
**Features:**
- Weekly calendar view
- Break scheduling
- Work hours tracking
- Performance stats
- Availability status

**UI Components:**
- Calendar widget
- Time entry form
- Break management
- Hours summary
- Attendance tracking
- Export timesheet

#### 6. **Earnings & Performance**
**URL:** `/driver/earnings`  
**Features:**
- Daily/weekly/monthly earnings
- Performance metrics
- Rating/reviews
- Delivery statistics
- Bonus tracking

**UI Components:**
- Earnings summary card
- Earnings chart (Line/Bar)
- Performance rating badge
- Detailed earnings breakdown
- Bonus details
- Withdrawal request form

---

## Client Dashboard

### Overview
**URL:** `/client`  
**Access:** Client role only  
**Purpose:** Self-service portal for bookings, order tracking, and profile management

### Key Features

#### 1. **Dashboard Overview (Main Page)**
**URL:** `/client`  
**Components:**
- Active bookings count
- Quick booking button
- Recent orders
- Notifications
- Support contact

```
┌─────────────────────────────────────┐
│     Client Portal                   │
├─────────────────────────────────────┤
│  Active Bookings: 2                 │
│  ┌───────────────────────────────┐ │
│  │ Order #2341                    │ │
│  │ Status: [🟢 In Transit]        │ │
│  │ Delivery ETA: 14:30            │ │
│  │ [📍Track] [📞Contact Driver]   │ │
│  └───────────────────────────────┘ │
│                                      │
│  Recent Orders                      │
│  ┌──────────────────────────────┐  │
│  │ Order #2340 - Completed ✓    │  │
│  │ Order #2339 - Completed ✓    │  │
│  │ Order #2338 - Completed ✓    │  │
│  └──────────────────────────────┘  │
│                                      │
│  [📋 New Booking] [📊 View History] │
│  [⚙️ Settings]    [❓ Support]      │
└─────────────────────────────────────┘
```

#### 2. **New Booking**
**URL:** `/client/new-booking`  
**Features:**
- Booking form with pickup/delivery details
- Date/time selection
- Material type selection
- Weight/volume input
- Special instructions
- Cost estimation
- Booking confirmation

**UI Components:**
- Multi-step form
- Location autocomplete
- Date/time picker
- Material selector dropdown
- Weight/volume input fields
- Cost calculator
- Confirmation modal
- Email confirmation

#### 3. **Track Order**
**URL:** `/client/track/:orderId`  
**Features:**
- Real-time order tracking map
- Driver location (if available)
- Current status
- ETA
- Driver contact information
- Order history
- Status updates via notification

**UI Components:**
- Interactive map with markers
- Status timeline
- Driver information card
- Contact driver button
- Estimated delivery time
- Route visualization
- Previous stops

#### 4. **Order History**
**URL:** `/client/history`  
**Features:**
- All past orders list
- Filters by date, status, driver
- Order details
- Invoice download
- Reorder functionality
- Rating/review submission

**UI Components:**
- Order list/table with search
- Date range filter
- Status filter
- Order details modal
- Invoice PDF viewer
- Rating/review form
- Download/export buttons

#### 5. **Profile & Account Settings**
**URL:** `/client/profile`  
**Features:**
- Edit profile information
- Multiple delivery addresses
- Payment methods
- Notification preferences
- Communication history
- Account security

**UI Components:**
- Profile form
- Address book
- Payment method list
- Notification toggle switches
- Password change form
- Two-factor authentication setup
- Session management

#### 6. **Billing & Invoicing**
**URL:** `/client/billing`  
**Features:**
- Invoice history
- Payment history
- Billing address
- Outstanding invoices
- Invoice details
- Download invoices
- Payment method management

**UI Components:**
- Invoice list/table
- Payment status indicators
- Invoice PDF viewer
- Download button
- Payment reconciliation
- Outstanding balance summary
- Print invoice option

#### 7. **Support & Help**
**URL:** `/client/support`  
**Features:**
- FAQs
- Contact form
- Support ticket tracking
- Chat with support
- Documentation

**UI Components:**
- FAQ accordion
- Support form
- Ticket list
- Chat interface
- Knowledge base search
- Contact information

---

## Common Components

### Shared Across All Dashboards

#### 1. **Header/Navigation Bar**
```javascript
Components:
- Logo & branding
- User name display
- Role indicator
- Notifications bell (unread count)
- User profile dropdown (Profile, Settings, Logout)
- Quick search
```

#### 2. **Sidebar Navigation (Desktop)**
```javascript
Roles-Specific Menu:
Admin:
  - Dashboard
  - Users
  - Analytics & Reports
  - Settings
  - Monitoring
  - Audit Logs

Manager:
  - Dashboard
  - Drivers
  - Clients
  - Assignments
  - Reports
  - Communications

Driver:
  - Dashboard
  - Current Assignment
  - Schedule
  - Tracking
  - Earnings
  - Profile

Client:
  - Dashboard
  - New Booking
  - Track Order
  - History
  - Billing
  - Profile
```

#### 3. **Bottom Navigation (Mobile)**
- Show role-specific 3-5 main menu items
- Sticky positioning on mobile
- Icon + label

#### 4. **Notification Center**
- Notification list
- Mark as read
- Delete notifications
- Filter by type
- Real-time badge update

#### 5. **User Profile Dropdown**
```javascript
Options:
- View Profile
- Settings
- Help & Documentation
- Logout
- About/Version info
```

#### 6. **Footer**
- Copyright notice
- Quick links
- Contact information
- Legal links (Terms, Privacy)

#### 7. **Modals & Dialogs**
- Permission denied modal
- Confirmation dialogs
- Form modals
- Alert messages

#### 8. **Loading & Error States**
- Loading spinners
- Error boundary
- Empty state messages
- 404/403 pages

---

## Security & Access Control

### Implementation Strategy

#### 1. **Frontend RBAC**
```javascript
// ProtectedRoute Component Enhancement
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>

// Route Configuration with Role Checking
const adminRoutes = [
  { path: '/admin', component: AdminDashboard, requiredRole: 'admin' },
  { path: '/admin/users', component: UserManagement, requiredRole: 'admin' },
  // ...
];
```

#### 2. **Permission Checks**
```javascript
// Component-level permission checking
if (!hasPermission(userRole, 'manage_users')) {
  return <PermissionDenied />;
}
```

#### 3. **Backend Validation**
- All API endpoints must validate user role/permissions
- Never trust frontend permission state
- Implement JWT token-based authentication
- Rate limiting on API endpoints
- Log all sensitive operations

#### 4. **Security Best Practices**
- Store auth tokens securely (httpOnly cookies)
- Implement CSRF protection
- Validate all inputs
- Use HTTPS only
- Implement session timeout
- Log all access attempts
- Regular security audits

### Permission Matrix

```
┌────────────┬────────────┬────────────┬────────────┬────────────┐
│ Feature    │ Admin      │ Manager    │ Driver     │ Client     │
├────────────┼────────────┼────────────┼────────────┼────────────┤
│ View All   │ ✓          │ ✗          │ ✗          │ ✗          │
│ Users      │ Create/Del │ View Own   │ View Own   │ View Own   │
├────────────┼────────────┼────────────┼────────────┼────────────┤
│ Analytics  │ Full View  │ Team Only  │ Own Stats  │ Own Stats  │
├────────────┼────────────┼────────────┼────────────┼────────────┤
│ Reporting  │ Full       │ Team       │ ✗          │ Own        │
├────────────┼────────────┼────────────┼────────────┼────────────┤
│ Settings   │ System     │ Team       │ Profile    │ Profile    │
├────────────┼────────────┼────────────┼────────────┼────────────┤
│ Tracking   │ All Data   │ Team Only  │ Own Only   │ Own Orders │
└────────────┴────────────┴────────────┴────────────┴────────────┘
```

---

## Component Structure

### Recommended Folder Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── LoginPage.jsx
│   │   ├── RoleSelection.jsx
│   │   └── PermissionDenied.jsx
│   │
│   ├── Common/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── BottomNav.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── NotificationCenter.jsx
│   │   ├── UserProfileDropdown.jsx
│   │   └── TrackingMap.jsx
│   │
│   ├── Dashboard/
│   │   ├── AdminDashboard.jsx
│   │   ├── ManagerDashboard.jsx
│   │   ├── DriverDashboard.jsx
│   │   ├── ClientDashboard.jsx
│   │   └── MainDashboard.jsx (Router)
│   │
│   ├── Admin/
│   │   ├── pages/
│   │   │   ├── UserManagement.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── SystemSettings.jsx
│   │   │   ├── Monitoring.jsx
│   │   │   └── AuditLogs.jsx
│   │   ├── components/
│   │   │   ├── UserTable.jsx
│   │   │   ├── UserForm.jsx
│   │   │   ├── ReportBuilder.jsx
│   │   │   └── SettingsForm.jsx
│   │   └── AdminLayout.jsx
│   │
│   ├── Manager/
│   │   ├── pages/
│   │   │   ├── DriverManagement.jsx
│   │   │   ├── ClientManagement.jsx
│   │   │   ├── AssignmentManagement.jsx
│   │   │   ├── TeamReports.jsx
│   │   │   └── Communications.jsx
│   │   ├── components/
│   │   │   ├── DriverCard.jsx
│   │   │   ├── ClientCard.jsx
│   │   │   ├── AssignmentForm.jsx
│   │   │   └── ChatInterface.jsx
│   │   └── ManagerLayout.jsx
│   │
│   ├── Driver/
│   │   ├── pages/
│   │   │   ├── AssignmentDetails.jsx
│   │   │   ├── TaskManagement.jsx
│   │   │   ├── Schedule.jsx
│   │   │   ├── Tracking.jsx
│   │   │   └── Earnings.jsx
│   │   ├── components/
│   │   │   ├── CurrentAssignment.jsx
│   │   │   ├── DeliveryChecklist.jsx
│   │   │   ├── ProofOfDelivery.jsx
│   │   │   └── EarningsCard.jsx
│   │   └── DriverLayout.jsx
│   │
│   ├── Client/
│   │   ├── pages/
│   │   │   ├── NewBooking.jsx
│   │   │   ├── TrackOrder.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Billing.jsx
│   │   │   └── Support.jsx
│   │   ├── components/
│   │   │   ├── BookingForm.jsx
│   │   │   ├── OrderCard.jsx
│   │   │   ├── TrackingMap.jsx
│   │   │   └── InvoiceViewer.jsx
│   │   └── ClientLayout.jsx
│   │
│   ├── Fleet/
│   │   ├── FleetTracking.jsx
│   │   └── components/
│   │
│   ├── Inventory/
│   │   ├── InventoryQuality.jsx
│   │   └── components/
│   │
│   ├── Orders/
│   │   ├── OrderManagement.jsx
│   │   └── components/
│   │
│   └── Reports/
│       ├── ReportsBilling.jsx
│       └── components/
│
├── contexts/
│   ├── AuthContext.jsx (with permission checks)
│   ├── NotificationContext.jsx
│   └── ThemeContext.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── usePermission.js
│   ├── useRoleBasedRedirect.js
│   └── useRealTimeTracking.js
│
├── services/
│   ├── authService.js
│   ├── apiService.js
│   ├── RealtimeTrackingService.js
│   ├── notificationService.js
│   └── permissionService.js
│
├── styles/
│   ├── theme.js (Role-based themes)
│   ├── roleThemes.js
│   └── globalStyles.css
│
├── utils/
│   ├── rbac.js (Permission helpers)
│   ├── validators.js
│   ├── formatters.js
│   └── constants.js
│
├── mocks/
│   ├── userData.js
│   ├── driverData.js
│   ├── orderData.js
│   └── realtimeFeed.js
│
└── App.jsx
```

---

## React Component Examples

### 1. Enhanced ProtectedRoute Component

```javascript
// src/components/Common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/rbac';
import { Box, CircularProgress, Typography } from '@mui/material';
import PermissionDenied from '../Auth/PermissionDenied';

export default function ProtectedRoute({ 
  children, 
  requiredRole = null,
  requiredPermission = null 
}) {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0D1117',
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

  // Check role requirement
  if (requiredRole && userRole.toLowerCase() !== requiredRole.toLowerCase()) {
    return <PermissionDenied reason="Insufficient role access" />;
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return <PermissionDenied reason="Insufficient permissions" />;
  }

  return children;
}
```

### 2. RoleAwareSidebar Component

```javascript
// src/components/Common/Sidebar.jsx
import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Drawer } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import { getMenuItemsByRole } from '../../utils/menuConfig';

export default function Sidebar({ open, onClose }) {
  const { userRole } = useAuth();
  const menuItems = getMenuItemsByRole(userRole);

  return (
    <Drawer 
      open={open} 
      onClose={onClose}
      sx={{ width: 250 }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">RS&CO Tracking</Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.path} 
            component={RouterLink} 
            to={item.path}
            sx={{
              color: '#E6EDF3',
              '&:hover': { background: 'rgba(255,111,0,0.1)' }
            }}
          >
            <ListItemIcon sx={{ color: '#FF6F00' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
```

### 3. RBAC Utility Functions

```javascript
// src/utils/rbac.js
export const ROLE_PERMISSIONS = {
  admin: [
    'read_all',
    'write_all',
    'manage_users',
    'manage_roles',
    'view_analytics',
    'manage_settings',
  ],
  manager: [
    'read_team',
    'write_team',
    'manage_drivers',
    'manage_clients',
    'view_team_reports',
    'assign_tasks',
  ],
  driver: [
    'read_own',
    'update_status',
    'view_schedule',
    'view_assignments',
    'update_location',
  ],
  client: [
    'read_own',
    'create_bookings',
    'view_history',
    'view_profile',
  ],
};

export const hasPermission = (userRole, requiredPermission) => {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole.toLowerCase()]?.includes(
    requiredPermission
  ) || false;
};

export const canAccessRoute = (userRole, requiredRole) => {
  if (!requiredRole) return true; // Public route
  return userRole?.toLowerCase() === requiredRole.toLowerCase();
};

export const getMenuItemsByRole = (userRole) => {
  const menuConfig = {
    admin: [
      { path: '/admin', label: 'Dashboard', icon: <DashboardIcon /> },
      { path: '/admin/users', label: 'Users', icon: <PeopleIcon /> },
      { path: '/admin/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
      { path: '/admin/settings', label: 'Settings', icon: <SettingsIcon /> },
    ],
    manager: [
      { path: '/manager', label: 'Dashboard', icon: <DashboardIcon /> },
      { path: '/manager/drivers', label: 'Drivers', icon: <LocalShippingIcon /> },
      { path: '/manager/clients', label: 'Clients', icon: <PeopleIcon /> },
      { path: '/manager/assignments', label: 'Assignments', icon: <AssignmentIcon /> },
    ],
    driver: [
      { path: '/driver', label: 'Dashboard', icon: <DashboardIcon /> },
      { path: '/driver/assignments', label: 'Assignments', icon: <AssignmentIcon /> },
      { path: '/driver/schedule', label: 'Schedule', icon: <CalendarIcon /> },
      { path: '/driver/earnings', label: 'Earnings', icon: <MoneyIcon /> },
    ],
    client: [
      { path: '/client', label: 'Dashboard', icon: <DashboardIcon /> },
      { path: '/client/new-booking', label: 'New Booking', icon: <AddIcon /> },
      { path: '/client/track', label: 'Track Orders', icon: <LocalShippingIcon /> },
      { path: '/client/history', label: 'History', icon: <HistoryIcon /> },
    ],
  };

  return menuConfig[userRole?.toLowerCase()] || [];
};
```

### 4. Updated App.jsx Routes Structure

```javascript
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import { getThemeByRole } from './roleThemes';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Auth
import LoginPage from './components/Auth/LoginPage';
import RoleSelection from './components/Auth/RoleSelection';

// Dashboards
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
import DriverDashboard from './components/Dashboard/DriverDashboard';
import ClientDashboard from './components/Dashboard/ClientDashboard';

// Admin Routes
import UserManagement from './components/Admin/pages/UserManagement';
import Analytics from './components/Admin/pages/Analytics';
import SystemSettings from './components/Admin/pages/SystemSettings';
import Monitoring from './components/Admin/pages/Monitoring';

// Manager Routes
import DriverManagement from './components/Manager/pages/DriverManagement';
import ClientManagement from './components/Manager/pages/ClientManagement';
import AssignmentManagement from './components/Manager/pages/AssignmentManagement';
import TeamReports from './components/Manager/pages/TeamReports';

// Driver Routes
import AssignmentDetails from './components/Driver/pages/AssignmentDetails';
import TaskManagement from './components/Driver/pages/TaskManagement';
import DriverSchedule from './components/Driver/pages/Schedule';
import DriverTracking from './components/Driver/pages/Tracking';
import DriverEarnings from './components/Driver/pages/Earnings';

// Client Routes
import NewBooking from './components/Client/pages/NewBooking';
import TrackOrder from './components/Client/pages/TrackOrder';
import OrderHistory from './components/Client/pages/OrderHistory';
import ClientProfile from './components/Client/pages/Profile';
import ClientBilling from './components/Client/pages/Billing';
import ClientSupport from './components/Client/pages/Support';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/role-selection" element={<RoleSelection />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute requiredRole="admin">
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requiredRole="admin">
              <SystemSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/monitoring" element={
            <ProtectedRoute requiredRole="admin">
              <Monitoring />
            </ProtectedRoute>
          } />

          {/* Manager Routes */}
          <Route path="/manager" element={
            <ProtectedRoute requiredRole="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/manager/drivers" element={
            <ProtectedRoute requiredRole="manager">
              <DriverManagement />
            </ProtectedRoute>
          } />
          <Route path="/manager/clients" element={
            <ProtectedRoute requiredRole="manager">
              <ClientManagement />
            </ProtectedRoute>
          } />
          <Route path="/manager/assignments" element={
            <ProtectedRoute requiredRole="manager">
              <AssignmentManagement />
            </ProtectedRoute>
          } />
          <Route path="/manager/reports" element={
            <ProtectedRoute requiredRole="manager">
              <TeamReports />
            </ProtectedRoute>
          } />

          {/* Driver Routes */}
          <Route path="/driver" element={
            <ProtectedRoute requiredRole="driver">
              <DriverDashboard />
            </ProtectedRoute>
          } />
          <Route path="/driver/assignments" element={
            <ProtectedRoute requiredRole="driver">
              <AssignmentDetails />
            </ProtectedRoute>
          } />
          <Route path="/driver/tasks" element={
            <ProtectedRoute requiredRole="driver">
              <TaskManagement />
            </ProtectedRoute>
          } />
          <Route path="/driver/schedule" element={
            <ProtectedRoute requiredRole="driver">
              <DriverSchedule />
            </ProtectedRoute>
          } />
          <Route path="/driver/tracking" element={
            <ProtectedRoute requiredRole="driver">
              <DriverTracking />
            </ProtectedRoute>
          } />
          <Route path="/driver/earnings" element={
            <ProtectedRoute requiredRole="driver">
              <DriverEarnings />
            </ProtectedRoute>
          } />

          {/* Client Routes */}
          <Route path="/client" element={
            <ProtectedRoute requiredRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/client/new-booking" element={
            <ProtectedRoute requiredRole="client">
              <NewBooking />
            </ProtectedRoute>
          } />
          <Route path="/client/track/:orderId" element={
            <ProtectedRoute requiredRole="client">
              <TrackOrder />
            </ProtectedRoute>
          } />
          <Route path="/client/history" element={
            <ProtectedRoute requiredRole="client">
              <OrderHistory />
            </ProtectedRoute>
          } />
          <Route path="/client/profile" element={
            <ProtectedRoute requiredRole="client">
              <ClientProfile />
            </ProtectedRoute>
          } />
          <Route path="/client/billing" element={
            <ProtectedRoute requiredRole="client">
              <ClientBilling />
            </ProtectedRoute>
          } />
          <Route path="/client/support" element={
            <ProtectedRoute requiredRole="client">
              <ClientSupport />
            </ProtectedRoute>
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

---

## Database Schema Recommendations

### Core Tables

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  role ENUM('admin', 'manager', 'driver', 'client') NOT NULL,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Managers Table
CREATE TABLE managers (
  id UUID PRIMARY KEY,
  user_id UUID FOREIGN KEY REFERENCES users(id),
  department VARCHAR(100),
  team_size INT,
  performance_rating DECIMAL(3,2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Drivers Table
CREATE TABLE drivers (
  id UUID PRIMARY KEY,
  user_id UUID FOREIGN KEY REFERENCES users(id),
  manager_id UUID FOREIGN KEY REFERENCES managers(id),
  vehicle_id VARCHAR(50),
  license_number VARCHAR(50) UNIQUE,
  rating DECIMAL(3,2),
  status ENUM('active', 'on_break', 'offline', 'suspended') DEFAULT 'offline',
  total_deliveries INT DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Clients Table
CREATE TABLE clients (
  id UUID PRIMARY KEY,
  user_id UUID FOREIGN KEY REFERENCES users(id),
  company_name VARCHAR(255),
  address VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  credit_limit DECIMAL(12,2),
  total_orders INT DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID FOREIGN KEY REFERENCES clients(id),
  driver_id UUID FOREIGN KEY REFERENCES drivers(id),
  manager_id UUID FOREIGN KEY REFERENCES managers(id),
  pickup_location VARCHAR(255),
  delivery_location VARCHAR(255),
  material_type VARCHAR(100),
  weight DECIMAL(10,2),
  volume DECIMAL(10,2),
  status ENUM('pending', 'assigned', 'in_transit', 'delivered', 'cancelled') DEFAULT 'pending',
  pickup_time TIMESTAMP,
  delivery_time TIMESTAMP,
  expected_delivery TIMESTAMP,
  special_instructions TEXT,
  cost DECIMAL(10,2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Real-time Tracking Table
CREATE TABLE vehicle_tracking (
  id UUID PRIMARY KEY,
  driver_id UUID FOREIGN KEY REFERENCES drivers(id),
  vehicle_id VARCHAR(50),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  speed DECIMAL(5,2),
  heading INT,
  timestamp TIMESTAMP,
  order_id UUID FOREIGN KEY REFERENCES orders(id)
);

-- Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID FOREIGN KEY REFERENCES users(id),
  action VARCHAR(255),
  resource_type VARCHAR(100),
  resource_id VARCHAR(100),
  changes JSON,
  ip_address VARCHAR(50),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## UI/UX Best Practices

### Design Principles

1. **Consistency**
   - Use consistent color scheme across roles
   - Maintain consistent typography
   - Use the same component styles

2. **Clarity**
   - Clear information hierarchy
   - Descriptive labels and buttons
   - Status indicators are clear and intuitive

3. **Efficiency**
   - Minimize clicks to complete tasks
   - Quick actions available
   - Keyboard shortcuts for power users

4. **Feedback**
   - Real-time status updates
   - Success/error messages
   - Loading indicators
   - Confirmation dialogs for destructive actions

5. **Responsiveness**
   - Mobile-first approach
   - Flexible layouts
   - Touch-friendly buttons (min 48px)
   - Readable font sizes

### Color Scheme

```css
/* Primary Brand Colors */
--primary: #FF6F00 (Orange)
--secondary: #7B61FF (Purple)
--background: #0D1117 (Dark)
--surface: #161B22 (Slightly lighter)
--text-primary: #E6EDF3 (Light)
--text-secondary: #8B949E (Muted)

/* Status Colors */
--success: #2EA043 (Green)
--error: #DA3633 (Red)
--warning: #D29922 (Yellow)
--info: #0969DA (Blue)
```

### Typography

- Headings: Roboto Bold (700-800)
- Body Text: Roboto Regular (400)
- Small Text: Roboto Regular (300-400)
- Monospace: Roboto Mono (for data)

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Set up RBAC infrastructure
- [ ] Create ProtectedRoute component
- [ ] Implement role-based themes
- [ ] Build authentication flow

### Phase 2: Admin Dashboard (Week 3-4)
- [ ] User management
- [ ] Analytics dashboard
- [ ] System settings
- [ ] Admin monitoring

### Phase 3: Manager Dashboard (Week 5-6)
- [ ] Driver management
- [ ] Client management
- [ ] Assignment management
- [ ] Team reports

### Phase 4: Driver & Client (Week 7-8)
- [ ] Driver app with tracking
- [ ] Client self-service portal
- [ ] Real-time updates
- [ ] Notifications

### Phase 5: Polish & Testing (Week 9-10)
- [ ] Performance optimization
- [ ] Security audit
- [ ] User testing
- [ ] Bug fixes

---

## Summary

This comprehensive role-based dashboard architecture provides:

✅ **Clear separation of concerns** - Each role has its own dedicated interface
✅ **Scalable RBAC** - Easy to add new roles or permissions
✅ **Secure by default** - Frontend and backend validation
✅ **Consistent UX** - Unified design language across roles
✅ **Mobile-responsive** - Works on all devices
✅ **Real-time updates** - Live tracking and notifications
✅ **User-friendly** - Intuitive navigation and workflows

By following this design, you can build a powerful, secure, and user-friendly multi-role tracking system that meets all enterprise requirements.
